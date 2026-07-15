import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.join(__dirname, "../..");
export const curatedPath = path.join(root, "src/data/curatedMedia.js");

export async function loadCuratedMedia() {
  const mod = await import(`file://${curatedPath}`);
  return mod.curatedMedia;
}

export function saveCuratedMedia(curated, stats) {
  const output = `import { mediaManifest } from "./mediaManifest.js";

/** Image-led curated subset — originals are never modified. */
export const curatedMedia = ${JSON.stringify(curated, null, 2)};

export const mediaStats = ${JSON.stringify(stats, null, 2)};

export { mediaManifest };
`;

  fs.writeFileSync(curatedPath, output, "utf8");
}

export function walkCuratedItems(curated) {
  const items = [];

  const push = (item) => {
    if (item && item.id) items.push(item);
  };

  push(curated.hero?.photo);

  for (const photo of curated.birthdayIdentity?.photos ?? []) push(photo);
  for (const photo of curated.since?.photos ?? []) push(photo);
  for (const photo of curated.memories?.featured ?? []) push(photo);
  for (const photo of curated.memories?.mosaic ?? []) push(photo);
  for (const still of curated.littleMoments?.stills ?? []) push(still);
  for (const photo of curated.littleMoments?.photos ?? []) push(photo);
  push(curated.letter?.photo);
  push(curated.specialSong?.photo);
  for (const photo of curated.final?.photos ?? []) push(photo);

  return items;
}

export function isHeicLike(nameOrPath = "") {
  return /\.heic$/i.test(nameOrPath) || /\.heif$/i.test(nameOrPath);
}

export function isWebFriendlySrc(src = "") {
  return /\.(jpe?g|png|webp)$/i.test(src);
}

export function publicPathToDisk(webPath) {
  return path.join(root, "public", webPath.replace(/^\//, ""));
}

export function buildMediaStats(curated, manifestLength) {
  const items = walkCuratedItems(curated);
  const photos = items.filter((i) => i.kind === "photo");
  const motionStills = items.filter((i) => i.kind === "motion-still");

  return {
    totalManifestEntries: manifestLength,
    curatedImageCount: items.length,
    curatedPhotoCount: photos.length,
    curatedMotionStillCount: motionStills.length,
    webDerivativePhotos: photos.filter((p) => p.src.includes("/web/photos/")).length,
    motionStillDerivatives: motionStills.length,
  };
}
