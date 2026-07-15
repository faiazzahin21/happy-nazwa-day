import fs from "fs";
import path from "path";
import {
  buildMediaStats,
  isHeicLike,
  isWebFriendlySrc,
  loadCuratedMedia,
  publicPathToDisk,
  root,
  saveCuratedMedia,
  walkCuratedItems,
} from "./lib/curated-media-io.mjs";

const WEB_PHOTOS_DIR = path.join(root, "public/assets/memories/web/photos");

function outputNameForItem(item) {
  const num = item.id.replace(/^(photo|motion)-/, "");
  return `img-${num.padStart(3, "0")}.jpg`;
}

async function convertHeic(inputPath, outputPath) {
  const convert = (await import("heic-convert")).default;
  const input = fs.readFileSync(inputPath);
  const jpeg = await convert({ buffer: input, format: "JPEG", quality: 0.92 });
  fs.writeFileSync(outputPath, Buffer.from(jpeg));
}

async function main() {
  const { curatedMedia, mediaManifest } = await import(
    `file://${path.join(root, "src/data/curatedMedia.js")}`
  );
  const curated = structuredClone(curatedMedia);

  fs.mkdirSync(WEB_PHOTOS_DIR, { recursive: true });

  const photoItems = walkCuratedItems(curated).filter((item) => item.kind === "photo");
  const targets = photoItems.filter(
    (item) => isHeicLike(item.originalName) || isHeicLike(item.originalSrc) || isHeicLike(item.src),
  );

  if (targets.length === 0) {
    console.log("No HEIC/HEIF curated photos need conversion.");
  }

  let converted = 0;
  const failures = [];

  for (const item of targets) {
    const originalDisk = publicPathToDisk(item.originalSrc || item.src);
    const outputName = outputNameForItem(item);
    const outputPath = path.join(WEB_PHOTOS_DIR, outputName);
    const webSrc = `/assets/memories/web/photos/${outputName}`;

    if (!fs.existsSync(originalDisk)) {
      failures.push({ id: item.id, error: `Source missing: ${originalDisk}` });
      continue;
    }

    try {
      if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
        await convertHeic(originalDisk, outputPath);
      }
      item.src = webSrc;
      converted += 1;
      console.log(`✓ ${item.id} → ${webSrc}`);
    } catch (err) {
      failures.push({ id: item.id, error: err.message || String(err) });
      console.error(`✗ ${item.id}: ${err.message || err}`);
    }
  }

  for (const item of photoItems) {
    if (!isWebFriendlySrc(item.src) && !failures.some((f) => f.id === item.id)) {
      failures.push({ id: item.id, error: `Non-web-friendly src remains: ${item.src}` });
    }
  }

  const stats = buildMediaStats(curated, mediaManifest.length);
  saveCuratedMedia(curated, stats);

  console.log(`\nDone: ${converted} HEIC/HEIF photo(s) converted.`);
  if (failures.length > 0) {
    console.log(`Warnings: ${failures.length} item(s) need attention.`);
    for (const f of failures) console.log(`  - ${f.id}: ${f.error}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
