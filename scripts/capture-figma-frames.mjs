#!/usr/bin/env node
// Usage: node scripts/capture-figma-frames.mjs [base-url]
// Captures PNG frames of every declared page at Figma-friendly canvas sizes.
// Output: figma/frames/<size>/<page-id>.png
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = process.argv[2] || 'http://localhost:5173';
const SIZES = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
];
const PAGES = [
  { id: 'application-list',      path: '/applications',                title: '申請單管理 — 申請單列表' },
  { id: 'new-application',       path: '/applications/new',            title: '申請單管理 — 新增申請單' },
  { id: 'vsaas-form',            path: '/applications/new/vsaas',      title: '申請單管理 — 新增 VSaaS 使用申請單' },
  { id: 'cloud-ai-vlm-profiles', path: '/cloud-ai',                    title: 'Cloud AI 設定 — VLM Profiles' },
  { id: 'cloud-ai-prompts',      path: '/cloud-ai',                    title: 'Cloud AI 設定 — Prompts',       clickTab: 1 },
  { id: 'cloud-ai-plans',        path: '/cloud-ai',                    title: 'Cloud AI 設定 — AI Plans',      clickTab: 2 },
  { id: 'cloud-ai-vendor',       path: '/cloud-ai',                    title: 'Cloud AI 設定 — Vendor AI',     clickTab: 3 },
  { id: 'design-system',         path: '/design-system',               title: 'Design System' },
];

const outRoot = resolve('./figma/frames');
mkdirSync(outRoot, { recursive: true });

const browser = await chromium.launch();
const manifest = { generatedAt: new Date().toISOString(), base: BASE, sizes: SIZES.map(s => s.name), pages: [] };

for (const size of SIZES) {
  const dir = resolve(outRoot, size.name);
  mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1 });
  for (const p of PAGES) {
    const page = await ctx.newPage();
    const url = `${BASE}${p.path}`;
    console.log(`[${size.name}] ${p.id} → ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(600);
    if (p.clickTab !== undefined) {
      // Click tab by index
      await page.evaluate((idx) => {
        const tabs = [...document.querySelectorAll('[role="tab"]')];
        if (tabs[idx]) tabs[idx].click();
      }, p.clickTab);
      await page.waitForTimeout(400);
    }
    const file = resolve(dir, `${p.id}.png`);
    await page.screenshot({ path: file, fullPage: false });
    if (size.name === SIZES[0].name) manifest.pages.push({ id: p.id, path: p.path, title: p.title });
    await page.close();
  }
  await ctx.close();
}

writeFileSync(resolve(outRoot, 'manifest.json'), JSON.stringify(manifest, null, 2));
await browser.close();
console.log(`\n✓ captured ${PAGES.length} pages × ${SIZES.length} sizes → ${outRoot}`);
console.log(`  manifest: ${resolve(outRoot, 'manifest.json')}`);
