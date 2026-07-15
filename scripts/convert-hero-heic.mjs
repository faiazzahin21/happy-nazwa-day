import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import convert from "heic-convert";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const source = path.join(root, "public/assets/memories/photos/IMG_8043.HEIC");
const outDir = path.join(root, "public/assets/memories/web");
const output = path.join(outDir, "IMG_8043.jpg");

if (!fs.existsSync(source)) {
  console.error("Source not found:", source);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const input = fs.readFileSync(source);
const jpeg = await convert({
  buffer: input,
  format: "JPEG",
  quality: 0.92,
});

fs.writeFileSync(output, Buffer.from(jpeg));
console.log("Wrote", output);
