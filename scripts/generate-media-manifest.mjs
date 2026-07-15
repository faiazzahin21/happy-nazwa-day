import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../public/assets/memories');

const photoExts = new Set(['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp']);
const videoExts = new Set(['.mp4', '.mov', '.m4v']);

function listMedia(dir, type) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) return [];

  return fs
    .readdirSync(fullDir)
    .filter((name) => {
      const ext = path.extname(name).toLowerCase();
      return type === 'photo' ? photoExts.has(ext) : videoExts.has(ext);
    })
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map((name, index) => {
      const idNum = String(index + 1).padStart(3, '0');
      return {
        id: `${type}-${idNum}`,
        type,
        src: `/assets/memories/${dir}/${name}`,
        originalName: name,
        suggestedUse: 'memory',
      };
    });
}

const photos = listMedia('photos', 'photo');
const videos = listMedia('videos', 'video');
const manifest = [...photos, ...videos];

const output = `export const mediaManifest = ${JSON.stringify(manifest, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, '../src/data/mediaManifest.js'), output, 'utf8');

console.log(`Generated mediaManifest.js — ${photos.length} photos, ${videos.length} videos`);
