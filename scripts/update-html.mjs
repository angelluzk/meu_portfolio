import fg from 'fast-glob';
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import cheerio from 'cheerio';
import sharp from 'sharp';

const ROOT = process.cwd();
const HTML_GLOBS = [
  'index.html',
  'partials/**/*.html',
  'projetos/**/*.html'
];

function fileExists(p) {
  try { return existsSync(p); } catch { return false; }
}

async function getDimensions(imgAbsPath) {
  try {
    const meta = await sharp(imgAbsPath).metadata();
    return { width: meta.width || null, height: meta.height || null };
  } catch {
    return { width: null, height: null };
  }
}

function isInsidePicture($, img) {
  return $(img).parent().is('picture');
}

function buildPicture({ relPng, relWebp, relAvif, attrs, width, height }) {
  // Remonta <img> preservando atributos úteis
  const {
    alt = '',
    class: klass,
    id,
    style,
    loading,
    decoding,
    fetchpriority,
    ...rest
  } = attrs;

  const safeAttrs = [];
  if (alt) safeAttrs.push(`alt="${alt}"`);
  if (klass) safeAttrs.push(`class="${klass}"`);
  if (id) safeAttrs.push(`id="${id}"`);
  if (style) safeAttrs.push(`style="${style}"`);
  // Decisões de performance:
  const loadingAttr = loading || 'lazy';
  const decodingAttr = decoding || 'async';

  safeAttrs.push(`loading="${loadingAttr}"`);
  safeAttrs.push(`decoding="${decodingAttr}"`);

  // width/height ajudam a matar CLS
  if (width && height) {
    safeAttrs.push(`width="${width}"`);
    safeAttrs.push(`height="${height}"`);
  }

  // fetchpriority só deve ser "high" em LCP — aqui não impomos
  if (fetchpriority) safeAttrs.push(`fetchpriority="${fetchpriority}"`);

  // sources (se existirem)
  const sources = [];
  if (relAvif) {
    sources.push(`<source type="image/avif" srcset="${relAvif}">`);
  }
  if (relWebp) {
    sources.push(`<source type="image/webp" srcset="${relWebp}">`);
  }

  const imgTag = `<img src="${relPng}" ${safeAttrs.join(' ')}>`;
  return `<picture>
  ${sources.join('\n  ')}
  ${imgTag}
</picture>`;
}

async function processHtml(filePath) {
  const abs = resolve(ROOT, filePath);
  const html = await readFile(abs, 'utf-8');
  const $ = cheerio.load(html, { decodeEntities: false });

  let changed = 0;

  const imgs = $('img[src$=".png"]');
  for (const el of imgs) {
    if (isInsidePicture($, el)) continue;

    const $img = $(el);
    const src = $img.attr('src');
    if (!src || src.startsWith('data:')) continue;

    // Caminhos relativos ao ROOT
    const pngAbs = resolve(ROOT, src);
    if (!fileExists(pngAbs)) continue;

    const base = src.replace(/\.png$/i, '');
    const webpRel = `${base}.webp`;
    const avifRel = `${base}.avif`;

    const webpAbs = resolve(ROOT, webpRel);
    const avifAbs = resolve(ROOT, avifRel);

    // Se não existirem versões modernas, pule (talvez ainda não rodou optimize)
    const hasWebp = fileExists(webpAbs);
    const hasAvif = fileExists(avifAbs);
    if (!hasWebp && !hasAvif) continue;

    const { width, height } = await getDimensions(pngAbs);

    // Coleta atributos do IMG
    const attrs = $img.get(0).attribs || {};
    const picture = buildPicture({
      relPng: src,
      relWebp: hasWebp ? webpRel : null,
      relAvif: hasAvif ? avifRel : null,
      attrs,
      width,
      height,
    });

    $img.replaceWith(picture);
    changed++;
  }

  if (changed > 0) {
    // Backup .bak
    await copyFile(abs, abs + '.bak');
    await writeFile(abs, $.html(), 'utf-8');
    console.log(`✓ ${filePath} — atualizado (${changed} imagem(ns))`);
  } else {
    console.log(`- ${filePath} — sem alterações`);
  }
}

async function main() {
  const files = (await Promise.all(HTML_GLOBS.map(g => fg(g)))).flat();

  if (!files.length) {
    console.log('Nenhum HTML encontrado para atualizar.');
    return;
  }

  for (const f of files) {
    await processHtml(f);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
