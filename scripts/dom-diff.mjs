#!/usr/bin/env node
// Usage: node scripts/dom-diff.mjs <kdc-url> <ours-url> [outPath]
// Extracts every visible leaf element from both pages, pairs by tag+text, reports position/size/style diffs.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const AUTH_STATE = resolve('./.auth/kdc.json');

const [, , urlA, urlB, outPath = './figma/dom-diff.json'] = process.argv;
if (!urlA || !urlB) {
  console.error('Usage: node scripts/dom-diff.mjs <kdc-url> <ours-url> [outPath]');
  process.exit(1);
}

const VIEWPORT = { width: 1440, height: 900 };

async function extract(page, url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(500); // let fonts settle
  return await page.evaluate(() => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      const r = node.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (node.offsetParent === null && node.tagName !== 'BODY') continue;
      // Skip SCRIPT/STYLE/TITLE etc.
      if (['SCRIPT', 'STYLE', 'TITLE', 'META', 'LINK', 'HEAD'].includes(node.tagName)) continue;
      // Direct text of this element (not descendants) — used as a matching key
      let directText = '';
      for (const c of node.childNodes) {
        if (c.nodeType === 3 && c.textContent.trim()) {
          directText += c.textContent.trim() + ' ';
        }
      }
      directText = directText.trim().slice(0, 60);
      const cs = getComputedStyle(node);
      out.push({
        tag: node.tagName,
        text: directText,
        x: Math.round(r.left),
        y: Math.round(r.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
        fs: cs.fontSize,
        fw: cs.fontWeight,
        color: cs.color,
        bg: cs.backgroundColor,
      });
    }
    return out;
  });
}

const browser = await chromium.launch();
const ctxOpts = { viewport: VIEWPORT, deviceScaleFactor: 1 };
if (existsSync(AUTH_STATE)) {
  ctxOpts.storageState = AUTH_STATE;
  console.log(`[auth] using ${AUTH_STATE}`);
}
const ctx = await browser.newContext(ctxOpts);
const pa = await ctx.newPage();
const pb = await ctx.newPage();

console.log(`[kdc]  loading ${urlA} …`);
const a = await extract(pa, urlA);
console.log(`[kdc]  ${a.length} leaf elements`);
console.log(`[ours] loading ${urlB} …`);
const b = await extract(pb, urlB);
console.log(`[ours] ${b.length} leaf elements`);
await browser.close();

// Pair by tag+text key (first occurrence)
const bIdx = new Map();
b.forEach((it, i) => {
  const k = `${it.tag}|${it.text}`;
  if (!bIdx.has(k)) bIdx.set(k, i);
});
const used = new Set();

const diffs = { missingInOurs: [], onlyInOurs: [], mismatched: [], summary: {} };
for (const ia of a) {
  const k = `${ia.tag}|${ia.text}`;
  if (!bIdx.has(k)) {
    diffs.missingInOurs.push(ia);
    continue;
  }
  const bi = bIdx.get(k);
  used.add(bi);
  const ib = b[bi];
  const dx = ib.x - ia.x, dy = ib.y - ia.y, dw = ib.w - ia.w, dh = ib.h - ia.h;
  const posDiff = Math.abs(dx) > 2 || Math.abs(dy) > 2;
  const sizeDiff = Math.abs(dw) > 2 || Math.abs(dh) > 2;
  const styleDiff = ia.fs !== ib.fs || ia.fw !== ib.fw;
  if (posDiff || sizeDiff || styleDiff) {
    diffs.mismatched.push({
      tag: ia.tag,
      text: ia.text,
      delta: { dx, dy, dw, dh },
      kdc: { x: ia.x, y: ia.y, w: ia.w, h: ia.h, fs: ia.fs, fw: ia.fw, color: ia.color, bg: ia.bg },
      ours: { x: ib.x, y: ib.y, w: ib.w, h: ib.h, fs: ib.fs, fw: ib.fw, color: ib.color, bg: ib.bg },
      flags: [posDiff && 'pos', sizeDiff && 'size', styleDiff && 'style'].filter(Boolean),
    });
  }
}
b.forEach((it, i) => { if (!used.has(i)) diffs.onlyInOurs.push(it); });

diffs.summary = {
  kdcElements: a.length,
  oursElements: b.length,
  missingInOurs: diffs.missingInOurs.length,
  onlyInOurs: diffs.onlyInOurs.length,
  mismatched: diffs.mismatched.length,
  posMismatched: diffs.mismatched.filter((d) => d.flags.includes('pos')).length,
  sizeMismatched: diffs.mismatched.filter((d) => d.flags.includes('size')).length,
  styleMismatched: diffs.mismatched.filter((d) => d.flags.includes('style')).length,
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(diffs, null, 2));
console.log('\n=== summary ===');
console.log(diffs.summary);
console.log(`\nfull report → ${outPath}`);

// Top 15 largest position offsets for quick eyeball
const topPos = diffs.mismatched
  .filter((d) => d.flags.includes('pos'))
  .sort((x, y) => Math.abs(y.delta.dx) + Math.abs(y.delta.dy) - Math.abs(x.delta.dx) - Math.abs(x.delta.dy))
  .slice(0, 15);
if (topPos.length) {
  console.log('\n=== top 15 position offsets (our − kdc) ===');
  for (const d of topPos) {
    const preview = d.text ? `"${d.text.slice(0, 20)}"` : '(no text)';
    console.log(`  [${d.tag.padEnd(6)}] ${preview.padEnd(24)} Δx=${String(d.delta.dx).padStart(5)}  Δy=${String(d.delta.dy).padStart(5)}  kdc=(${d.kdc.x},${d.kdc.y})  ours=(${d.ours.x},${d.ours.y})`);
  }
}
