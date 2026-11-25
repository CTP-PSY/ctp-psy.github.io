# CTP-PSY

The global psytrance community portal of the CTPVerse — psytrance only.

CTP Music covers many genres; CTP-PSY is just for the psytrance demographic:
global psytrance news and events syndicated in one place, with Bandcamp
players and radio.

- Live site: https://ctp-psy.github.io/
- Org: https://github.com/CTP-PSY
- Built with [Hugo](https://gohugo.io/) (extended 0.152.2), deployed via
  GitHub Pages + GitHub Actions.
- 52 themes, CTP-EOS Cynamic (eos) default, CTP-EOS Calamares first in the
  picker. Theme persists per device (`ctp-psy-theme`); width toggle
  nuke/full with `?width=full` override.

## Layout

Single-page Nuke portal (same chrome as the CTP Music Portal):

- `hugo.toml` — baseURL, title, no taxonomies
- `content/_index.md` — front matter only
- `layouts/` — `baseof.html`, `index.html` (centre column), partials
  (`head`, `header`, `footer`, `scripts`, `sidebar-left`, `sidebar-right`)
- `assets/css/main.css` — the 52-theme stylesheet (Hugo pipes, fingerprinted)
- `static/js/` — `main.js` (theme/width, channel directory, poll),
  `ctp-music.js` (laut.fm player, 25 stations), `sites-rotator.js`
- `static/assets/` — banners, branding, ads

## Notes

- Org banner: the user supplies the real CTP-PSY banner. The file at
  `static/assets/branding/ctp-psy-org-avatar.jpg` is a stand-in (the CTP
  Energy logo) — replace it when the real banner lands.
- Content is seeded: real verified items (Boom 2027, OZORA, Universo
  Paralello, Bandcamp embeds) mixed with clearly-marked placeholder
  seed entries (artist lineups, blog posts, extra events) to be swapped
  for real items as they are confirmed.

## License

MIT — Copyright (c) 2026 CTP Energy, LLC. See LICENSE.
