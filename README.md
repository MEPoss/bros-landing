# brOS landing

Landing page for [brOS](https://github.com/MEPoss/bros), a Mac browser that treats open tabs like files.
Live at https://www.ugopossenti.com/bros/ (also https://bros.ugopossenti.com).

Plain HTML, CSS and JS, no build step. Every push to `main` is published by Vercel.

## Keeping it in step with the app

- The page reads the latest release of `MEPoss/bros` when it opens (version, DMG link and size).
- `.github/workflows/sync-app.yml` runs every three hours: it refreshes `release.json` and the page's
  structured data, and opens an issue when the app's README changes, so the copy can be updated.
- `assets/README.txt` lists the screenshots and where they come from.

Search icons and the idea of the page come from [Search](https://searchbrowser.app) (MIT); brOS is a fork of it.
