#!/usr/bin/env node
// Usage: node scripts/pixel-diff.mjs <kdc-url> <ours-url> [outDir]
// Takes same-viewport screenshots in chromium, produces pixelmatch diff PNG + % mismatch.
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const AUTH_STATE = resolve('./.auth/kdc.json');

const [, , urlA, urlB, outDir = './figma/pixel-diff'] = process.argv;
if (!urlA || !urlB) {
  console.error('Usage: node scripts/pixel-diff.mjs <kdc-url> <ours-url> [outDir]');
  process.exit(1);
}

const VIEWPORT = { width: 1440, height: 900 };
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const ctxOpts = { viewport: VIEWPORT, deviceScaleFactor: 1 };
if (existsSync(AUTH_STATE)) {
  ctxOpts.storageState = AUTH_STATE;
  console.log(`[auth] using ${AUTH_STATE}`);
}
const ctx = await browser.newContext(ctxOpts);
const page = await ctx.newPage();

const aPath = resolve(outDir, 'a-kdc.png');
const bPath = resolve(outDir, 'b-ours.png');

console.log(`[kdc]  screenshot ${urlA} …`);
await page.goto(urlA, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(500);
await page.screenshot({ path: aPath, fullPage: false });

console.log(`[ours] screenshot ${urlB} …`);
await page.goto(urlB, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(500);
await page.screenshot({ path: bPath, fullPage: false });

await browser.close();

const imgA = PNG.sync.read(readFileSync(aPath));
const imgB = PNG.sync.read(readFileSync(bPath));
if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
  console.error(`size mismatch: kdc=${imgA.width}x${imgA.height}  ours=${imgB.width}x${imgB.height}`);
  process.exit(2);
}
const { width, height } = imgA;
const diff = new PNG({ width, height });
const mismatched = pixelmatch(imgA.data, imgB.data, diff.data, width, height, {
  threshold: 0.1,
  includeAA: false,
  alpha: 0.5,
  diffColor: [255, 0, 0],
});
const diffPath = resolve(outDir, 'diff.png');
writeFileSync(diffPath, PNG.sync.write(diff));

const pct = ((mismatched / (width * height)) * 100).toFixed(2);
console.log(`\n=== pixel diff ===`);
console.log(`  mismatched: ${mismatched} px  (${pct}% of ${width}×${height})`);
console.log(`  kdc:  ${aPath}`);
console.log(`  ours: ${bPath}`);
console.log(`  diff: ${diffPath}   (red = different pixels)`);
