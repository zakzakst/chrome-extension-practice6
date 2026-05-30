import { ZipArchive } from "archiver";
import fs from "node:fs";
import path from "node:path";

const SOURCE_DIR = "dist";
const TEMP_DIR = "downloads/chrome-extension";
const ZIP_NAME = "downloads/chrome-extension.zip";

// dist → コピー
fs.cpSync(SOURCE_DIR, TEMP_DIR, {
  recursive: true,
});

// zip作成
const output = fs.createWriteStream(ZIP_NAME);

const archive = new ZipArchive("zip", {
  zlib: { level: 9 },
});

archive.pipe(output);

archive.directory(TEMP_DIR, false);

await archive.finalize();

// zip完了待機
await new Promise((resolve) => {
  output.on("close", resolve);
});

// コピーしたフォルダ削除
fs.rmSync(TEMP_DIR, {
  recursive: true,
  force: true,
});

console.log("Package Complete!");
