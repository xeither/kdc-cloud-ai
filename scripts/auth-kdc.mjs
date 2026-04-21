#!/usr/bin/env node
// Usage: node scripts/auth-kdc.mjs
// Opens headed Chrome so you can log into KDC manually. Session is saved to .auth/kdc.json
// and reused by diff:dom / diff:pixel. Run once; rerun if session expires.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const AUTH_DIR = resolve('./.auth');
const STATE_PATH = resolve(AUTH_DIR, 'kdc.json');
mkdirSync(AUTH_DIR, { recursive: true });

const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('https://wr-rd-kmp-aa.kalay.us/internal/tutk/Rlist');
console.log('\n→ Log in manually in the Chrome window.');
console.log('→ Once you see the KDC home page, return to this terminal and press Enter.\n');

await new Promise((res) => {
  process.stdin.once('data', res);
  process.stdin.resume();
});

await ctx.storageState({ path: STATE_PATH });
await browser.close();
console.log(`✓ session saved to ${STATE_PATH}`);
process.exit(0);
