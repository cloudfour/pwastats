#!/usr/bin/env node

const Purgecss = require('purgecss');
const fetch = require('node-fetch');
const { writeFileSync } = require('fs');
const { join } = require('path');

const main = async () => {
  const originalCss = await fetch(
    'https://cloudfour-patterns.netlify.com/assets/toolkit/styles/toolkit.css'
  ).then(res => res.text());
  console.log('fetched toolkit css, starting purging process');
  const purgeCss = new Purgecss({
    content: ['**/*.html'],
    css: [{ raw: originalCss }],
    rejected: true
  });
  const result = purgeCss.purge();
  writeFileSync(join('_site', 'main.css'), result[0].css);
};

main();
