/**
 * The repository's own contract gate.
 *
 * ADR 0004 decision 7 makes this a SECOND, independent check: KusaBuilder
 * validates before it writes a branch, and this validates again in the
 * repository's own CI. Two gates that can disagree are the point -- if the
 * platform ever loosened a rule, this one would still refuse.
 *
 * It is standalone on purpose. Importing KusaBuilder's validator would make the
 * second gate a copy of the first, and a copy is not an independent check.
 */

import { readFileSync, statSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

/** Cloudflare Pages refuses any single file above this at upload. */
const MAX_FILE_BYTES = 25 * 1024 * 1024;

const contract = JSON.parse(readFileSync('kusa.config.json', 'utf8'));
const failures = [];

if (contract.maxAssetBytes > MAX_FILE_BYTES) {
  failures.push(
    `kusa.config.json declares maxAssetBytes ${contract.maxAssetBytes}, above Cloudflare's ${MAX_FILE_BYTES}.`,
  );
}

/** Walks without following symlinks: a link out of the tree is not ours to size. */
const walk = async (root) => {
  const found = [];
  const visit = async (directory) => {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        await visit(full);
        continue;
      }
      if (entry.isFile()) found.push(full);
    }
  };
  await visit(root);
  return found;
};

const scanRoot = async (root, limit, label) => {
  for (const file of await walk(root)) {
    const { size } = statSync(file);
    if (size <= limit) continue;
    failures.push(`${label}: ${file} is ${size} bytes, over ${limit}.`);
  }
};

for (const root of contract.assetRoots) {
  await scanRoot(root, contract.maxAssetBytes, 'source asset');
}

// The output scan only runs when a build has happened. A source file under the
// ceiling can still produce an output file over it, which is the whole reason
// this is two scans rather than one.
try {
  statSync(contract.outputDirectory);
  await scanRoot(contract.outputDirectory, MAX_FILE_BYTES, 'build output');
} catch {
  process.stdout.write(
    `No ${contract.outputDirectory}/ yet; run the build first to scan output files.\n`,
  );
}

if (failures.length > 0) {
  process.stderr.write(`Contract validation failed:\n${failures.map((f) => `  ${f}`).join('\n')}\n`);
  process.exit(1);
}

process.stdout.write('Contract validation passed.\n');
