#!/usr/bin/env node

var { readdir, writeFile, readFile } = require('fs');
const { promisify } = require('util');
const sharp = require('sharp');
const { join, extname } = require('path');
const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const SVGO = require('svgo');
const svgo = new SVGO({});

const ls = promisify(readdir);
const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);

/**
 * @param {Buffer} image
 */
const optimize = image =>
  imagemin.buffer(image, { plugins: [mozjpeg(), pngquant()] });

/**
 * Resizes an image and writes it to disk
 * @param {sharp.SharpInstance} image
 * @param {number} width
 * @param {string} name directory image belongs in
 * @param {string} outFile file name for image
 */
const resizeWrite = async (image, width, name, outFile) => {
  const resized = image.resize(width);
  const outPath = join('images', name, outFile);
  const optimized = await optimize(await resized.toBuffer());
  return writeFileAsync(outPath, optimized);
};

/**
 * Finds the extension of the file `original.*`
 * @param {string} name the directory to look in
 */
const getExt = async name => {
  const files = await ls(join('images', name));
  return extname(files.find(f => f.startsWith('original.')));
};

const processSvg = async name => {
  const source = await readFileAsync(
    join('images', name, 'original.svg'),
    'utf8'
  );
  const output = (await svgo.optimize(source)).data;
  return writeFileAsync(join('images', name, '2x.svg'), output);
};

/**
 * @param {string} name folder of image to read
 */
const processImage = async name => {
  const ext = await getExt(name);
  if (ext === '.svg') {
    return processSvg(name);
  }
  const inputPath = join('images', name, 'original' + ext);
  const img = sharp(inputPath);
  return resizeWrite(img, 122, name, '2x' + ext);
};

const main = async () => {
  const files = await ls('images');
  const processed = await Promise.all(files.map(processImage));
};

main().catch(err => console.error(err.stack));
