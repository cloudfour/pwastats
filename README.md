# PWAStats

> A directory of Progressive Web App case studies.

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md)

## Developing

This site is built with [Jekyll](https://jekyllrb.com/docs/home/).

### Quick start

This project relies on [Ruby](https://www.ruby-lang.org/en/), [Node](https://nodejs.org/), and [npm](https://www.npmjs.com/). Before following these steps you'll need to [set up a Ruby dev environment](https://jekyllrb.com/docs/installation/) as well as [install node and npm](https://blog.npmjs.org/post/85484771375/how-to-install-npm) if you haven't already.

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

### Fetching an icon for a PWA

```sh
npm run fetch-icon
```

This will ask you for the PWA url and the directory to download to. It will fetch the icon from the app's `manifest.json`.

### Resizing icons

To resize all the PWA icons in `images`:

1.  Run `npm install` to install the dependencies
2.  Run `npm run resize-images` to automatically generate optimized 1x and 2x versions of the images
