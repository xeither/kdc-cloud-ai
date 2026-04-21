#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, '../src/design-tokens.json');
const out = resolve(__dirname, '../figma/tokens-studio.json');

const raw = JSON.parse(readFileSync(src, 'utf8'));
const version = raw.$version;
const { $description, $version, ...tokenGroups } = raw;

const wrapped = {
  global: tokenGroups,
  $themes: [],
  $metadata: {
    tokenSetOrder: ['global'],
    sourceVersion: version,
    generatedAt: new Date().toISOString(),
    sourceFile: 'src/design-tokens.json',
  },
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(wrapped, null, 2));
console.log(`✓ wrote ${out} (global set, v${version})`);
