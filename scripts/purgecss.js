#!/usr/bin/env node

const Purgecss = require('purgecss');
const fetch = require('node-fetch');
const { writeFileSync } = require('fs');

/**
 * Fetches the latest css from the pattern library, and extracts the used css from it to main.css
 */
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
  // This does not output in _site because jekyll will delete it
  // outputs in the root instead because then jekyll will copy it to _site
  writeFileSync('main.css', result[0].css);
};

main();
