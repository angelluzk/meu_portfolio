// scripts/optimize-images.mjs
import fg from "fast-glob";
import { dirname, join, resolve, basename } from "node:path";
import { mkdir, copyFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import sharp from "sharp";
import pLimit from "p-limit";

const ROOT = process.cwd();
const IMG_DIR = join(ROOT, "assets", "img");
const BACKUP_DIR = join(IMG_DIR, ".backup");

const limit = pLimit(4);

async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

async function backupOriginal(srcPath) {
  const rel = srcPath.replace(IMG_DIR, "").replace(/^\\|^\//, "");
  const dest = join(BACKUP_DIR, rel);
  await ensureDir(dirname(dest));
  if (!existsSync(dest)) await copyFile(srcPath, dest);
}

async function optimizePng(pngPath) {
  try {
    return await sharp(pngPath)
      .png({ compressionLevel: 9, palette: true, effort: 10 })
      .toBuffer();
  } catch (err) {
    console.error("⚠️ Erro ao otimizar:", pngPath, "-", err.message);
    return null;
  }
}

async function toWebp(pngPath) {
  try {
    return await sharp(pngPath)
      .webp({ quality: 80, effort: 6, alphaQuality: 80 })
      .toBuffer();
  } catch (err) {
    console.error("⚠️ Erro ao gerar WebP:", pngPath, "-", err.message);
    return null;
  }
}

async function toAvif(pngPath) {
  try {
    return await sharp(pngPath).avif({ quality: 65, effort: 6 }).toBuffer();
  } catch (err) {
    console.error("⚠️ Erro ao gerar AVIF:", pngPath, "-", err.message);
    return null;
  }
}

async function processOne(pngPath) {
  const absPath = resolve(pngPath);
  const dir = dirname(absPath);
  const base = basename(absPath, ".png");

  const webpOut = join(dir, `${base}.webp`);
  const avifOut = join(dir, `${base}.avif`);

  await backupOriginal(absPath);

  const optimized = await optimizePng(absPath);
  if (!optimized) throw new Error("Falha ao otimizar PNG");

  await writeFile(absPath, optimized);

  const webp = await toWebp(absPath);
  if (webp) await writeFile(webpOut, webp);

  const avif = await toAvif(absPath);
  if (avif) await writeFile(avifOut, avif);

  return true;
}

async function main() {
  const pattern = `${IMG_DIR.replace(/\\/g, "/")}/**/*.png`;
  const files = await fg(pattern);
  if (!files.length) {
    console.log("Nenhuma imagem PNG encontrada em", IMG_DIR);
    return;
  }

  console.log(`Encontradas ${files.length} PNG(s). Iniciando otimização…`);

  let ok = 0,
    fail = 0;

  const tasks = files.map((p) =>
    limit(async () => {
      try {
        await processOne(p);
        ok++;
        console.log("✓", p.replace(ROOT + "\\", "").replace(ROOT + "/", ""));
      } catch (err) {
        fail++;
        console.error("✗ Falhou em", p, "-", err.message);
      }
    })
  );

  await Promise.all(tasks);
  console.log(`\n✅ Concluído. Otimizadas: ${ok} | Falhas: ${fail}`);
  console.log(`Backup dos PNGs originais em: ${BACKUP_DIR}`);
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
