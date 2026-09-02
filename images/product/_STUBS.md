# Product media stubs

Replace each file **in place** (same path and filename). The site already points at these names. Crop tight to the app chrome unless noted.

Kids-safe playlist only (public-domain or your own audio) so YouTube thumbs are publishable.

## Specs

- Desktop stills: **1600×1000** WebP (16:10). Electron window ~1280px wide.
- Phone stills: **750×1624** WebP (≈9:19.5). Real device or 270–390 CSS px wide. Survival layout is `max-width: 310px` if you want that tier.
- Video: silent, loop-friendly. WebM + MP4 fallback.

## Desktop (Electron)

| File | Shoot |
| --- | --- |
| `desktop-editor.webp` | Two-column: Search left, playlist slats right. Hero still / video poster. |
| `desktop-url-import.webp` | Search after pasting a **playlist or channel** URL. Nested title box; several rows checked. |
| `desktop-artwork.webp` | Artwork flyout: 5×7 cover, generate / upload / crop. |
| `desktop-track-art-icons.webp` | Track Art, Icons tab (Yoto library + yotoicons.com search). |
| `desktop-track-art-draw.webp` | Draw tab: 16×16 canvas + palette (LED preview if visible). |
| `desktop-trim.webp` | Trim flyout: waveform + in/out times + Play. |
| `desktop-split.webp` | Playlist with connected Part 1 / Part 2 slats on a long source. |
| `desktop-update.webp` | Update in progress **or** “Normalize new track levels?” cover. |
| `desktop-setup.webp` | First-run wizard with **Use default client** visible. Used in `#setup`. |
| `ha-addon.webp` | Home Assistant Supervisor Add-on store showing **Louis** after the repo is added. Wallpaper around HA is OK. |

## Phone

| File | Shoot |
| --- | --- |
| `phone-search.webp` | Search tab + YouTube rows. |
| `phone-library.webp` | Library / playlist fan. |
| `phone-add.webp` | Add-to-playlist drawer. |
| `phone-menu.webp` | Menu with Update (pink pending) and Add to Home. |

## Video (`/video/`)

When files exist, add them as the first `<source>` tags on the How-it-works `<video>` (before the GitHub README clip):

```html
<source src="/video/hero-loop.webm" type="video/webm" />
<source src="/video/hero-loop.mp4" type="video/mp4" />
```

Do **not** add empty placeholder files — Vite would serve `index.html` instead of a 404, and the player would choke.

| File | Shoot |
| --- | --- |
| `hero-loop.webm` + `hero-loop.mp4` | **8–12s, silent, loop.** Search → check/drag onto playlist → slats land. Poster = `desktop-editor.webp`. Until these exist, the How-it-works demo uses the GitHub README clip. |
| `trim.webm` + `trim.mp4` | Optional 6–8s: scissors → keep region → Apply. Skip if the hero loop already shows trim. |
| `track-art.webm` + `track-art.mp4` | Optional 6–8s: Icons search → apply, or Draw a few pixels → Apply. |

## Social (already on the site; recrop if the pitch changes)

| File | Size | Note |
| --- | --- | --- |
| `../louis-og.png` | 1200×630 | Wordmark + swan + desktop-editor crop. Alt: playlist studio, not “loads onto cards.” |
| `../louis-twitter-wide.png` | 1200×630 | Same composition. |
| `../louis-twitter-square.png` | 800×800 | Square crop of the same. |

## Already copied (no shoot)

How-it-works beats from the app: `../howto/search.png`, `add.png`, `listen.png`.
