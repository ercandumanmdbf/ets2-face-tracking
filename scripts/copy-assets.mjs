import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const source = resolve(root, 'node_modules', '@mediapipe', 'tasks-vision', 'wasm');
const destination = resolve(root, 'public', 'wasm');

await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true, force: true });
console.log('MediaPipe WASM dosyalari public/wasm dizinine kopyalandi.');
