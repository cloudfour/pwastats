#!/usr/bin/env node

var { readdir, writeFile } = require('fs');
const { promisify } = require('util');
const sharp = require('sharp');
const { join, extname } = require('path');
const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');

const ls = promisify(readdir);
const writeFileAsync = promisify(writeFile);

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
  return writeFileAsync(outPath, await optimize(await resized.toBuffer()));
};

/**
 * Finds the extension of the file `original.*`
 * @param {string} name the directory to look in
 */
const getExt = async name => {
  const files = await ls(join('images', name));
  return extname(files.find(f => f.startsWith('original.')));
};

/**
 * @param {string} name folder of image to read
 */
const processImage = async name => {
  const ext = await getExt(name);
  const inputPath = join('images', name, 'original' + ext);
  const img = sharp(inputPath);
  return Promise.all([
    resizeWrite(img, 61, name, '1x' + ext),
    resizeWrite(img, 122, name, '2x' + ext)
  ]);
};

const main = async () => {
  const files = await ls('images');
  const processed = await Promise.all(files.map(processImage));
};

main();
