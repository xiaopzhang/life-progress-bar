# Life Progress Bar

An immersive single-page life calendar. Run it locally with:

```bash
node scripts/serve-localhost.mjs
```

Then open `http://localhost:8080/`. The local server listens on both
`127.0.0.1` and `::1`, so `localhost` works whether your browser resolves it to
IPv4 or IPv6. You can also deploy the folder as a static site on Vercel or
Netlify.

## Files

- `index.html` is the app entry.
- `scripts/serve-localhost.mjs` serves the static app on localhost for local
  testing.
- `src/main.js` contains life calculations, animation state, ambient audio, and poster export.
- `src/styles.css` contains the visual system, responsive layout, and motion.

Life expectancy values are bundled from the UN World Population Prospects 2024 /
UNData life expectancy at birth, both sexes indicator. The experience is a
contemplative estimate, not a prediction.
