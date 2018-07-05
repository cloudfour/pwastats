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
jekyll serve
```

View the local site at http://localhost:4000.

### Resizing icons

To resize all the PWA icons in images/:
1. Install [imagemagick](https://www.imagemagick.org/script/download.php)
2. Run `npm install` to install imageoptim
3. Run `npm run resize-images` to resize/optimize the images
