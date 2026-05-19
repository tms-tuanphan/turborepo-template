#!/usr/bin/env node
/**
 * Validates .rules/FE/agents/feature/manifests/*.json paths exist.
 * Usage: node .rules/FE/scripts/validate-feature-manifests.mjs
 */
import { readdir, readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../../..');
const MANIFESTS_DIR = join(__dirname, '../agents/feature/manifests');

function globToCheck(globPath) {
  if (globPath.endsWith('/**')) {
    const base = globPath.slice(0, -3);
    return { type: 'dir', path: join(REPO_ROOT, base) };
  }
  return { type: 'file', path: join(REPO_ROOT, globPath) };
}

async function exists(path, type) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function collectPaths(manifest) {
  const paths = [];
  const { scope, forbiddenRoots = [], relatedDocs = [] } = manifest;
  if (scope.featureRoot) paths.push(scope.featureRoot);
  if (scope.publicApi) paths.push(scope.publicApi);
  for (const key of ['routes', 'apiRoutes', 'serverActions', 'authConfig']) {
    if (Array.isArray(scope[key])) paths.push(...scope[key]);
  }
  paths.push(...forbiddenRoots);
  paths.push(...relatedDocs);
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
  for (const p of collectPaths(manifest)) {
    if (p.startsWith('.rules/')) {
      const full = join(REPO_ROOT, p);
      if (!(await exists(full, 'file'))) {
        errors.push(`${file}: missing relatedDoc ${p}`);
      }
      continue;
    }
    const check = globToCheck(p);
    if (!(await exists(check.path, check.type))) {
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
    console.error('Manifest validation failed:\n');
    allErrors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log(`OK: ${jsonFiles.length} feature manifest(s) validated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
