/**
 * Re-export balloon assets with white backgrounds + letter holes removed.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const DIR = "public/assets/balloons";
const ALL = [
  "H",
  "A",
  "P",
  "Y",
  "B",
  "I",
  "R",
  "T",
  "D",
  "2",
  "5",
  "balloon-blue",
  "balloon-maroon",
];

const WHITE_LUMA = 242;
const WHITE_CHROMA = 22;
const SOFT_LUMA = 225;

function isNearWhite(r, g, b, lumaThresh = WHITE_LUMA, chromaThresh = WHITE_CHROMA) {
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  return luma >= lumaThresh && chroma <= chromaThresh;
}

function floodClearNearWhite(data, width, height, seeds, lumaThresh, chromaThresh) {
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qh = 0;
  let qt = 0;

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (data[i + 3] === 0) return;
    if (!isNearWhite(data[i], data[i + 1], data[i + 2], lumaThresh, chromaThresh)) return;
    visited[idx] = 1;
    queue[qt++] = idx;
  };

  for (const [x, y] of seeds) tryPush(x, y);

  while (qh < qt) {
    const idx = queue[qh++];
    const x = idx % width;
    const y = (idx / width) | 0;
    const i = idx * 4;
    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = 0;
    tryPush(x - 1, y);
    tryPush(x + 1, y);
    tryPush(x, y - 1);
    tryPush(x, y + 1);
  }
}

function clearEnclosedWhiteHoles(data, width, height) {
  const label = new Int32Array(width * height);
  let nextLabel = 1;
  const touchesBorder = new Map();

  const isCandidate = (i) =>
    data[i + 3] > 0 && isNearWhite(data[i], data[i + 1], data[i + 2], 248, 16);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      if (label[idx] || !isCandidate(idx * 4)) continue;

      const id = nextLabel++;
      const queue = [idx];
      label[idx] = id;
      let border = false;
      let qh = 0;

      while (qh < queue.length) {
        const cur = queue[qh++];
        const cx = cur % width;
        const cy = (cur / width) | 0;
        if (cx === 0 || cy === 0 || cx === width - 1 || cy === height - 1) border = true;

        const neighbors = [cur - 1, cur + 1, cur - width, cur + width];
        for (const n of neighbors) {
          if (n < 0 || n >= width * height) continue;
          const nx = n % width;
          const ny = (n / width) | 0;
          if (Math.abs(nx - cx) + Math.abs(ny - cy) !== 1) continue;
          if (label[n]) continue;
          if (!isCandidate(n * 4)) continue;
          label[n] = id;
          queue.push(n);
        }
      }

      touchesBorder.set(id, border);

      if (!border) {
        for (const cur of queue) {
          const i = cur * 4;
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
        }
      }
    }
  }
}

function softenFringe(data, width, height) {
  const copy = Buffer.from(data);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const idx = y * width + x;
      const i = idx * 4;
      if (copy[i + 3] === 0) continue;
      if (!isNearWhite(copy[i], copy[i + 1], copy[i + 2], SOFT_LUMA, 30)) continue;

      let clearNeighbor = false;
      for (let dy = -1; dy <= 1 && !clearNeighbor; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const ni = ((y + dy) * width + (x + dx)) * 4;
          if (copy[ni + 3] === 0) {
            clearNeighbor = true;
            break;
          }
        }
      }
      if (!clearNeighbor) continue;

      const luma = 0.299 * copy[i] + 0.587 * copy[i + 1] + 0.114 * copy[i + 2];
      const alpha = Math.max(0, Math.min(255, Math.round(((255 - luma) / 28) * 255)));
      data[i + 3] = Math.min(copy[i + 3], alpha);
      if (data[i + 3] < 10) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0;
      }
    }
  }
}

function removeWhiteBackground(data, width, height) {
  const edgeSeeds = [];
  for (let x = 0; x < width; x += 1) {
    edgeSeeds.push([x, 0], [x, height - 1]);
  }
  for (let y = 0; y < height; y += 1) {
    edgeSeeds.push([0, y], [width - 1, y]);
  }

  floodClearNearWhite(data, width, height, edgeSeeds, WHITE_LUMA, WHITE_CHROMA);
  clearEnclosedWhiteHoles(data, width, height);
  softenFringe(data, width, height);
}

async function convertOne(name) {
  const svgPath = path.join(DIR, `${name}.svg`);
  if (!fs.existsSync(svgPath)) {
    console.warn("skip missing", name);
    return;
  }

  const { data, info } = await sharp(svgPath, { density: 160 })
    .resize({ width: 320, height: 320, fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  removeWhiteBackground(data, info.width, info.height);

  const out = path.join(DIR, `${name}.webp`);
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 86, alphaQuality: 100 })
    .toFile(out);

  let transparent = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] === 0) transparent += 1;
  }
  const pct = ((transparent / (info.width * info.height)) * 100).toFixed(1);
  const mid = Math.floor(info.width / 2);
  const midY = Math.floor(info.height / 2);
  const mi = (midY * info.width + mid) * 4;
  console.log(
    `${name}.webp transparent=${pct}% centerA=${data[mi + 3]} cornerA=${data[3]}`,
  );
}

for (const name of ALL) {
  await convertOne(name);
}
