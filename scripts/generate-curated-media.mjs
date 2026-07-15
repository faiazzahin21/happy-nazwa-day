import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read mediaManifest by dynamic import
const manifestPath = path.join(__dirname, '../src/data/mediaManifest.js');
const manifestCode = fs.readFileSync(manifestPath, 'utf8');
const match = manifestCode.match(/export const mediaManifest = (\[[\s\S]*\]);/);
if (!match) throw new Error('Could not parse mediaManifest');
const mediaManifest = JSON.parse(match[1]);

const PHOTO_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const VIDEO_EXTS = new Set(['.mp4', '.m4v']);

function ext(name) {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i).toLowerCase() : '';
}

const allPhotos = mediaManifest.filter((m) => m.type === 'photo');
const allVideos = mediaManifest.filter((m) => m.type === 'video');
const compatiblePhotos = allPhotos.filter((m) => PHOTO_EXTS.has(ext(m.originalName)));
const compatibleVideos = allVideos.filter((m) => VIDEO_EXTS.has(ext(m.originalName)));

function pickEvery(pool, count, start = 0, step = 4) {
  const out = [];
  let idx = start;
  while (out.length < count && idx < pool.length) {
    out.push(pool[idx]);
    idx += step;
  }
  let cursor = idx;
  while (out.length < count && cursor < pool.length) {
    if (!out.includes(pool[cursor])) out.push(pool[cursor]);
    cursor += 1;
  }
  return out;
}

function pickVideos(pool, count, start = 0) {
  return pickEvery(pool, count, start, 2);
}

const usedIds = new Set();
function take(pool, count, start = 0, step = 4) {
  const items = [];
  let i = start;
  while (items.length < count && i < pool.length) {
    const item = pool[i];
    if (!usedIds.has(item.id)) {
      usedIds.add(item.id);
      items.push(item);
    }
    i += step;
  }
  for (let j = 0; items.length < count && j < pool.length; j++) {
    if (!usedIds.has(pool[j].id)) {
      usedIds.add(pool[j].id);
      items.push(pool[j]);
    }
  }
  return items;
}

let photoCursor = 0;
const HERO_PHOTO_NAME = "IMG_8043.HEIC";
const HERO_WEB_SRC = "/assets/memories/web/IMG_8043.jpg";
const pinnedHeroRaw = allPhotos.find((m) => m.originalName === HERO_PHOTO_NAME);
const pinnedHero = pinnedHeroRaw
  ? { ...pinnedHeroRaw, src: HERO_WEB_SRC }
  : null;
const heroPhoto = pinnedHero ? [pinnedHero] : take(compatiblePhotos, 1, photoCursor, 3);
if (pinnedHero) usedIds.add(pinnedHero.id);
photoCursor = 3;
const birthdayPhotos = take(compatiblePhotos, 2, photoCursor, 4);
photoCursor = 11;
const timelinePhotos = take(compatiblePhotos, 3, photoCursor, 5);
photoCursor = 26;
const memoryFeatured = take(compatiblePhotos, 6, photoCursor, 3);
const memorySupporting = take(compatiblePhotos, 8, photoCursor + 18, 4);
const letterPhoto = take(compatiblePhotos, 1, 70, 2);
const specialSongPhoto = take(compatiblePhotos, 1, 75, 2);
const finalPhotos = take(compatiblePhotos, 3, 80, 3);

const videoFeatured = take(compatibleVideos, 3, 0, 1);
const videoSupporting = take(compatibleVideos, 3, 3, 1);

const curated = {
  hero: { photo: heroPhoto[0] ?? null },
  birthdayIdentity: { photos: birthdayPhotos },
  timeline: { photos: timelinePhotos },
  memories: { featured: memoryFeatured, supporting: memorySupporting },
  videos: { featured: videoFeatured, supporting: videoSupporting },
  letter: { photo: letterPhoto[0] ?? null },
  specialSong: { photo: specialSongPhoto[0] ?? null },
  final: { photos: finalPhotos },
};

const stats = {
  totalPhotos: allPhotos.length,
  totalVideos: allVideos.length,
  compatiblePhotos: compatiblePhotos.length,
  compatibleVideos: compatibleVideos.length,
  curatedPhotoCount: [
    curated.hero.photo,
    ...curated.birthdayIdentity.photos,
    ...curated.timeline.photos,
    ...curated.memories.featured,
    ...curated.memories.supporting,
    curated.letter.photo,
    curated.specialSong.photo,
    ...curated.final.photos,
  ].filter(Boolean).length,
  curatedVideoCount: [
    ...curated.videos.featured,
    ...curated.videos.supporting,
  ].length,
};

const output = `import { mediaManifest } from "./mediaManifest.js";

/** Deterministic curated subset — personal files are not modified. */
export const curatedMedia = ${JSON.stringify(curated, null, 2)};

export const mediaStats = ${JSON.stringify(stats, null, 2)};

export { mediaManifest };
`;

fs.writeFileSync(path.join(__dirname, '../src/data/curatedMedia.js'), output, 'utf8');
console.log('curatedMedia.js generated:', stats);
