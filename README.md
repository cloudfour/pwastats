# PWAStats

> A directory of Progressive Web App case studies.

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md)

## Developing

This site is built with [Eleventy](https://www.11ty.dev/).

### Quick start

This project relies on [Node](https://nodejs.org/), and [npm](https://www.npmjs.com/). Before following these steps you'll need to [install node and npm](https://blog.npmjs.org/post/85484771375/how-to-install-npm) if you haven't already.

Installation:

1. Clone this repository.
1. `cd` into the directory.
1. Run `npm ci` to install dependencies.

For local development:

```
npm start
```
This will compile the site into the \_site directory and run a local file server where you can preview the site: http://localhost:8080

For a single build:

```
npm run build
```

### Fetching an icon for a PWA

```sh
npm run fetch-icon
```

This will ask you for the PWA url and the directory to download to. It will fetch the icon from the app's `manifest.json`.

### Resizing icons

To resize all the PWA icons in `images`:

1.  Run `npm install` to install the dependencies
2.  Run `npm run resize-images` to automatically generate optimized 1x and 2x versions of the images
