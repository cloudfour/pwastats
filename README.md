# PWAStats

> A directory of Progressive Web App case studies.

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md)

## Developing

This site is built with [Jekyll](https://jekyllrb.com/docs/home/).

### Quick start

```sh
git clone git@github.com:cloudfour/pwastats.git
cd pwastats
gem install bundler
bundle install
npm install
```

For local development:

```
npm start
```

For a single build:

```
npm run build
```

View the local site at http://localhost:4000.

### Resizing icons

To resize all the PWA icons in `images`:

1.  Run `npm install` to install the dependencies
2.  Run `npm run resize-images` to automatically generate optimized 1x and 2x versions of the images
