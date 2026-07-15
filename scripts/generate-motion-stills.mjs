import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import {
  buildMediaStats,
  loadCuratedMedia,
  publicPathToDisk,
  root,
  saveCuratedMedia,
} from "./lib/curated-media-io.mjs";

const execFileAsync = promisify(execFile);
const MOTION_DIR = path.join(root, "public/assets/memories/web/motion-stills");
const SEEK_TIMES = ["00:00:00.8", "00:00:00.5", "00:00:01.0"];

async function resolveFfmpeg() {
  try {
    const mod = await import("ffmpeg-static");
    if (mod.default && fs.existsSync(mod.default)) return mod.default;
  } catch {
    /* bundled ffmpeg unavailable */
  }

  try {
    const { stdout } = await execFileAsync("where", ["ffmpeg"], { shell: true });
    const first = stdout.trim().split(/\r?\n/)[0];
    if (first) return first;
  } catch {
    /* system ffmpeg not on PATH */
  }

  return null;
}

async function extractFrame(ffmpeg, inputPath, outputPath, seekTime) {
  await execFileAsync(
    ffmpeg,
    ["-y", "-ss", seekTime, "-i", inputPath, "-frames:v", "1", "-q:v", "3", outputPath],
    { timeout: 120000 },
  );
}

async function generateStill(ffmpeg, item) {
  const inputPath = publicPathToDisk(item.originalSrc);
  const outputPath = publicPathToDisk(item.src);

  if (!fs.existsSync(inputPath)) {
    return { item, ok: false, error: `Source missing: ${inputPath}` };
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  for (const seek of SEEK_TIMES) {
    try {
      await extractFrame(ffmpeg, inputPath, outputPath, seek);
      if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
        return { item, ok: true };
      }
    } catch (err) {
      if (seek === SEEK_TIMES[SEEK_TIMES.length - 1]) {
        return { item, ok: false, error: err.message || String(err) };
      }
    }
  }

  return { item, ok: false, error: "No frame extracted" };
}

async function main() {
  const { curatedMedia, mediaManifest } = await import(
    `file://${path.join(root, "src/data/curatedMedia.js")}`
  );
  const curated = structuredClone(curatedMedia);
  const stills = curated.littleMoments?.stills ?? [];

  if (stills.length === 0) {
    console.log("No motion stills configured in curatedMedia.littleMoments.stills.");
    process.exit(0);
  }

  fs.mkdirSync(MOTION_DIR, { recursive: true });

  const ffmpeg = await resolveFfmpeg();
  if (!ffmpeg) {
    console.error("ffmpeg not available. Install ffmpeg-static: npm install ffmpeg-static --save-dev");
    process.exit(1);
  }

  console.log("Using ffmpeg:", ffmpeg);
  console.log("Generating motion stills for", stills.length, "clip(s)...\n");

  let okCount = 0;
  for (const item of stills) {
    const result = await generateStill(ffmpeg, item);
    if (result.ok) {
      okCount += 1;
      console.log(`✓ ${item.id} → ${item.src}`);
    } else {
      console.error(`✗ ${item.id} (${item.originalName}): ${result.error}`);
    }
  }

  const stats = buildMediaStats(curated, mediaManifest.length);
  saveCuratedMedia(curated, stats);

  console.log(`\nDone: ${okCount}/${stills.length} motion still(s) generated.`);
  process.exit(okCount === stills.length ? 0 : okCount > 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
