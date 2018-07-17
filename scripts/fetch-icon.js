#!/usr/bin/env node

const inquirer = require('inquirer');
const xRay = require('x-ray')();
const fetch = require('node-fetch');
const { mkdirSync, writeFileSync, existsSync } = require('fs');
const { join, extname } = require('path');
const url = require('url');
const makeDriver = require('request-x-ray');

// mobile user agent because some sites only serve manifest/pwa for mobile
const headers = {
  'User-Agent':
    'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Mobile Safari/537.36'
};

xRay.driver(makeDriver({ headers }));

/**
 *
 * @param {string} size the size of the image, like "144x144"
 * @returns the first dimension, like 144
 */
const parseSize = size => parseInt(size.split('x')[0]);

/**
 *
 * @param {{sizes: string, src: string}[]} icons
 */
const findLargestIcon = icons => {
  const icon = icons.reduce((largestIcon, icon) => {
    if (
      parseSize(icon.sizes) >
      (largestIcon.sizes ? parseSize(largestIcon.sizes) : 0)
    ) {
      return icon;
    }
    return largestIcon;
  });
  return { icon: icon.src, size: icon.sizes };
};

/**
 * @param {string} u the url to retrieve the name from
 * @returns {string|undefined}
 */
const simplifyUrl = u => {
  const { hostname } = url.parse(u);
  if (hostname === null) {
    return undefined;
  }
  return hostname
    .replace(/\.[^.]*$/, '') // remove tld (last dot and everything after it)
    .replace(/^.*\./, '') // remove subdomains (everything up to the last dot)
    .toLowerCase();
};

const main = async () => {
  const { appUrl } = await inquirer.prompt([
    {
      name: 'appUrl',
      type: 'input',
      message: 'Link to a page in the PWA'
    }
  ]);
  const manifestLink = await xRay(appUrl, 'link[rel="manifest"]@href')
    .then(link => url.resolve(appUrl, link))
    .catch(err => {
      throw new Error(`Unable to find manifest for ${appUrl}`);
    });

  console.log(`Found manifest at ${manifestLink}`);

  const manifest = await fetch(manifestLink, { headers }).then(d => d.json());
  if (!manifest.icons) {
    throw new Error(`Manifest has no icons`);
  }
  const { icon, size } = findLargestIcon(manifest.icons);
  console.log(`Found icon (${size}) at ${icon}`);
  const { name } = await inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Folder name in `images`',
      default: simplifyUrl(appUrl)
    }
  ]);
  const dir = join('images', name);
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  const img = await fetch(url.resolve(appUrl, icon), { headers }).then(d =>
    d.buffer()
  );
  // remove query params from extension
  const ext = extname(icon).replace(/\?.*$/, '');
  const path = join(dir, 'original' + ext);
  writeFileSync(path, img);
  console.log(`Created file ${path}`);
};

main().catch(err =>
  console.error(`Error finding icon for PWA
${err.stack}`)
);
