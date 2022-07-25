#!/usr/bin/env node

const Purgecss = require('purgecss');
const { writeFileSync, readFileSync } = require('fs');
const path = require('path');

/**
 * Fetches the latest css from the pattern library, and extracts the used css from it to main.css
 */
const main = () => {
  const originalCss = readFileSync(path.join(__dirname, 'toolkit.css'));
  console.log('Fetched toolkit css, starting purging process');
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
