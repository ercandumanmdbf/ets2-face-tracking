import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import packageJson from '../package.json' with { type: 'json' };

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDestination = resolve(root, 'github-upload');
const releaseDestination = resolve(root, 'github-release');

function assertSafeDestination(destination, expectedName) {
  if (dirname(destination) !== root || destination !== join(root, expectedName)) {
    throw new Error(`Unsafe publish destination: ${destination}`);
  }
}

assertSafeDestination(sourceDestination, 'github-upload');
assertSafeDestination(releaseDestination, 'github-release');
await rm(sourceDestination, { recursive: true, force: true });
await rm(releaseDestination, { recursive: true, force: true });
await mkdir(sourceDestination, { recursive: true });
await mkdir(releaseDestination, { recursive: true });

const sourceEntries = [
  '.gitignore', 'electron', 'GITHUB_UPLOAD_GUIDE_TR.md', 'LICENSE', 'package.json',
  'package-lock.json', 'README.md', 'scripts', 'src', 'tests',
  'THIRD_PARTY_NOTICES.md', 'vite.config.js', 'vitest.config.js', 'docs',
];

for (const entry of sourceEntries) {
  await cp(join(root, entry), join(sourceDestination, entry), { recursive: true });
}

const artifactName = `TruckLook-${packageJson.version}-x64.exe`;
const artifactSource = join(root, 'release', artifactName);
const artifactDestination = join(releaseDestination, artifactName);
await cp(artifactSource, artifactDestination);
await cp(join(root, 'RELEASE_NOTES.md'), join(releaseDestination, 'RELEASE_NOTES.md'));

const artifact = await readFile(artifactDestination);
const sha256 = createHash('sha256').update(artifact).digest('hex').toUpperCase();
await writeFile(join(releaseDestination, 'SHA256SUMS.txt'), `${sha256}  ${artifactName}\n`, 'utf8');

console.log(`GitHub source: ${sourceDestination}`);
console.log(`GitHub release: ${releaseDestination}`);
console.log(`SHA256: ${sha256}`);
