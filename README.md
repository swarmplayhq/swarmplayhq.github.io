# swarmplayhq.github.io

The website for [SwarmPlay](https://github.com/swarmplayhq/swarmplay), served by GitHub Pages at
**https://swarmplayhq.github.io**.

Plain HTML, CSS and a little JavaScript; nothing to build. Push to `main` and Pages publishes it
within a minute or two.

- `index.html`: the page. Dark by default; the sun/moon button switches to light and remembers it.
- `assets/site.css`, `assets/site.js`: its styles; the install tabs and Copy button, screenshots
  full size, the latest version read from GitHub's API (the HTML carries the last known one, so the
  page is right without it), and sections easing in as they scroll into view.
- Download links point at `releases/latest/download/…`, so a new release needs no change here.
- `assets/shots/`: screenshots of the real launcher, taken with `scripts/site_shots.py` in the
  SwarmPlay repo, then `magick <shot>.png -resize 1600x -quality 80 <shot>.webp`.

To look at it locally: `python3 -m http.server` in this folder, then open http://localhost:8000.

The site is under the [MIT License](LICENSE), like SwarmPlay itself. Fonts: Inter and Inter Tight
(SIL Open Font License 1.1, `assets/fonts/OFL.txt`). Game art in the screenshots belongs to its owners.
