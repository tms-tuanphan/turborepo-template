#!/usr/bin/env node
/**
 * Validates .rules/BE/agents/module/manifests/*.json paths and schemaVersion.
 * Usage: node .rules/BE/scripts/validate-module-manifests.mjs
 */
import { readdir, readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../../..');
const MANIFESTS_DIR = join(__dirname, '../agents/module/manifests');
const SUPPORTED_SCHEMA_VERSION = 1;

function globToCheck(globPath) {
  if (globPath.endsWith('/**')) {
    const base = globPath.slice(0, -3);
    return { type: 'dir', path: join(REPO_ROOT, base) };
  }
  return { type: 'file', path: join(REPO_ROOT, globPath) };
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function collectPaths(manifest) {
  const paths = [];
  const { scope, forbiddenRoots = [], relatedRules = [] } = manifest;
  if (scope?.moduleRoot) paths.push(scope.moduleRoot);
  if (scope?.contractRoot) paths.push(scope.contractRoot);
  for (const key of [
    'controllers',
    'services',
    'tests',
    'databaseModels',
  ]) {
    if (Array.isArray(scope?.[key])) paths.push(...scope[key]);
  }
  paths.push(...forbiddenRoots);
  paths.push(...relatedRules);
  return paths;
}

async function validateManifest(file, content) {
  const errors = [];
  let manifest;
  try {
    manifest = JSON.parse(content);
  } catch (e) {
    return [`${file}: invalid JSON — ${e.message}`];
  }
  if (!manifest.id) errors.push(`${file}: missing "id"`);
  if (manifest.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    errors.push(
      `${file}: schemaVersion must be ${SUPPORTED_SCHEMA_VERSION}, got ${manifest.schemaVersion}`,
    );
  }
  for (const p of collectPaths(manifest)) {
    if (!p || p.length === 0) continue;
    if (p.startsWith('.rules/')) {
      const full = join(REPO_ROOT, p);
      if (!(await exists(full))) {
        errors.push(`${file}: missing relatedRule ${p}`);
      }
      continue;
    }
    const check = globToCheck(p);
    if (!(await exists(check.path))) {
      errors.push(`${file}: missing ${p}`);
    }
  }
  return errors;
}

async function main() {
  const entries = await readdir(MANIFESTS_DIR);
  const jsonFiles = entries.filter(
    (f) => f.endsWith('.json') && !f.startsWith('_'),
  );
  const allErrors = [];
  for (const file of jsonFiles) {
    const content = await readFile(join(MANIFESTS_DIR, file), 'utf8');
    allErrors.push(...(await validateManifest(file, content)));
  }
  if (allErrors.length > 0) {
    console.error('BE manifest validation failed:\n');
    allErrors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log(`OK: ${jsonFiles.length} module manifest(s) validated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
