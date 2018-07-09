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

### Fetching an icon for a PWA

```sh
npm run fetch-pwa-icon
```

This will ask you for the PWA url and the directory to download to. It will fetch the icon from the app's `manifest.json`.
