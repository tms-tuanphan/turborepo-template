#!/usr/bin/env node
/**
 * Validates .rules/shared/mappings/*.json paths and schemaVersion.
 * Usage: node .rules/shared/scripts/validate-cross-mappings.mjs
 */
import { readdir, readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../../..');
const MAPPINGS_DIR = join(__dirname, '../mappings');
const SUPPORTED_SCHEMA_VERSION = 1;

async function pathExists(relativePath) {
  if (!relativePath || relativePath === null) return true;
  try {
    await access(join(REPO_ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function validateMapping(file, content) {
  const errors = [];
  let mapping;
  try {
    mapping = JSON.parse(content);
  } catch (e) {
    return [`${file}: invalid JSON — ${e.message}`];
  }

  if (!mapping.id) errors.push(`${file}: missing "id"`);
  if (mapping.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    errors.push(
      `${file}: schemaVersion must be ${SUPPORTED_SCHEMA_VERSION}, got ${mapping.schemaVersion}`,
    );
  }

  const hasFe = mapping.feFeatureManifest != null && mapping.feFeatureManifest !== '';
  const hasBe = mapping.beModuleManifest != null && mapping.beModuleManifest !== '';

  if (!hasFe && !hasBe) {
    errors.push(
      `${file}: at least one of feFeatureManifest or beModuleManifest is required`,
    );
  }

  if (hasFe && !(await pathExists(mapping.feFeatureManifest))) {
    errors.push(`${file}: missing feFeatureManifest ${mapping.feFeatureManifest}`);
  }
  if (hasBe && !(await pathExists(mapping.beModuleManifest))) {
    errors.push(`${file}: missing beModuleManifest ${mapping.beModuleManifest}`);
  }
  if (
    mapping.contractRoot != null &&
    mapping.contractRoot !== '' &&
    !(await pathExists(mapping.contractRoot))
  ) {
    errors.push(`${file}: missing contractRoot ${mapping.contractRoot}`);
  }

  return errors;
}

async function main() {
  const entries = await readdir(MAPPINGS_DIR);
  const jsonFiles = entries.filter(
    (f) => f.endsWith('.json') && !f.startsWith('_'),
  );
  const allErrors = [];
  for (const file of jsonFiles) {
    const content = await readFile(join(MAPPINGS_DIR, file), 'utf8');
    allErrors.push(...(await validateMapping(file, content)));
  }
  if (allErrors.length > 0) {
    console.error('Shared mapping validation failed:\n');
    allErrors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log(`OK: ${jsonFiles.length} cross mapping(s) validated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
