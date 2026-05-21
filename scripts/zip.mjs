import fs from "node:fs";
import path from "node:path";
import { ZipArchive } from "archiver";

const SOURCE_DIR = "dist";
const ZIP_NAME = "downloads/chrome-extension-chrome-memo.zip";

// zip作成
const output = fs.createWriteStream(ZIP_NAME);

const archive = new ZipArchive("zip", {
  zlib: { level: 9 },
});

archive.pipe(output);

archive.directory(SOURCE_DIR, false);

await archive.finalize();

// zip完了待機
await new Promise((resolve) => {
  output.on("close", resolve);
});

console.log("Package Complete!");
