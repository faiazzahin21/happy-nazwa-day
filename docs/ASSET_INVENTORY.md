# Asset Inventory

Project asset organization for the SAJIDA NAZWA 25th birthday website.

## Design Assets Copied

### Backgrounds (3)
- `public/assets/backgrounds/bg-cream-paper.png`
- `public/assets/backgrounds/bg-soft-pink-gradient.png`
- `public/assets/backgrounds/bg-film-grain.png`

### Envelope (7)
- `public/assets/envelope/envelope-flap-top.png`
- `public/assets/envelope/envelope-flap-left.png`
- `public/assets/envelope/envelope-flap-right.png`
- `public/assets/envelope/envelope-flap-bottom.png`
- `public/assets/envelope/envelope-letter-card.png`
- `public/assets/envelope/heart-seal-red.png`
- `public/assets/envelope/heart-seal-gold.png`

### Branding (3)
- `public/assets/branding/sajida-nazwa-logo.png`
- `public/assets/branding/sn-monogram.png`
- `public/assets/branding/number-25-gold.png`

### Decorations (8)
- `public/assets/decorations/divider-gold-flourish.png`
- `public/assets/decorations/corner-floral-left.png`
- `public/assets/decorations/sparkle-gold.png`
- `public/assets/decorations/floating-petal.png`
- `public/assets/decorations/floating-heart.png`
- `public/assets/decorations/heart-pin.png`
- `public/assets/decorations/timeline-line-gold.png`
- `public/assets/decorations/timeline-dot-heart.png`

### Scrapbook (4)
- `public/assets/scrapbook/polaroid-frame.png`
- `public/assets/scrapbook/photo-tape-pink.png`
- `public/assets/scrapbook/photo-tape-cream.png`
- `public/assets/scrapbook/paper-clip-gold.png`

### Letter (3)
- `public/assets/letter/letter-paper-main.png`
- `public/assets/letter/letter-fold-shadow.png`
- `public/assets/letter/signature-seemon.png`

### Icons (3)
- `public/assets/icons/music-button.png`
- `public/assets/icons/play-heart-button.png`
- `public/assets/icons/gallery-next.png`

### Final Section (3)
- `public/assets/final/birthday-cake-25.mp4`
- `public/assets/final/final-heart-frame.png`
- `public/assets/final/final-birthday-illustration.png`

**Critical:** `birthday-cake-25.mp4` exists at `public/assets/final/birthday-cake-25.mp4` for the final birthday/ending section.

## Missing Optional Assets

| Expected Source | Status | Notes |
|---|---|---|
| `E:\Assets\final-birthday-illustration.png` | Missing | Copied from typo variant `final-birthday-illustratio.png` and saved as correctly named `final-birthday-illustration.png` |
| `E:\Assets\2(1).m4a` | Missing | Used `E:\Assets\2.m4a` instead → `happy-birthday-song.m4a` |
| `jumping-chick(1).zip` | Missing | Font folder `E:\Assets\jumping-chick\` already contained extracted fonts |
| `havana-personal-use-only(1).zip` | Missing | Font folder `E:\Assets\havana-personal-use-only\` already contained extracted fonts |
| `happy-birthday-demo(1).zip` | Missing | Font folder `E:\Assets\happy-birthday-demo\` already contained extracted fonts |

## Assets Intentionally Not Copied (CSS/SVG Later)

- `gallery-close` icon — **implemented** as `.close-icon-css` in `src/styles/components.css`
- `soft glow` — **implemented** as `.soft-glow` in `src/styles/layout.css` and `SoftGlow.jsx`
- `corner-floral-right.png` — **planned** via CSS `transform: scaleX(-1)` on `corner-floral-left.png` (verified in debug screen)
- `gallery-prev.png` — **planned** via CSS `transform: scaleX(-1)` on `gallery-next.png` (verified in debug screen)

## Additional Source Assets Not Mapped

These exist in `E:\Assets` but were not part of the required copy map:

- `date-card-born.png` — reserved for a future date-card section
- `corner-floral-right.png` — CSS mirror planned
- `gallery-prev.png` — CSS mirror planned

## Fonts Copied

| File | Destination |
|---|---|
| `Jumping Chick.otf` | `public/assets/fonts/Jumping Chick.otf` |
| `Jumping Chick.ttf` | `public/assets/fonts/Jumping Chick.ttf` |
| `Havana.ttf` | `public/assets/fonts/Havana.ttf` |
| `HappyBirthday_Demo.ttf` | `public/assets/fonts/HappyBirthday_Demo.ttf` |

Font preview images inside font folders were not copied (design/font package assets only).

### Font files loaded in Step 2 (`src/styles/fonts.css`)

| CSS font-family | Source file | Status |
|---|---|---|
| `"Havana"` | `/assets/fonts/Havana.ttf` | Loaded |
| `"HappyBirthday"` | `/assets/fonts/HappyBirthday_Demo.ttf` | Loaded |
| `"JumpingChick"` | `/assets/fonts/Jumping Chick.otf` | Loaded (URL-encoded space) |

`Jumping Chick.ttf` also available at `/assets/fonts/Jumping Chick.ttf` for fallback if needed later.

## Music Copied

| Source | Destination | Usage (later) |
|---|---|---|
| `E:\Assets\1.mp3` | `public/assets/music/special-song.mp3` | Emotional favorite song (love letter / special sections) |
| `E:\Assets\2.m4a` | `public/assets/music/happy-birthday-song.m4a` | Opening / birthday celebration mood |

Music will not autoplay before user interaction. Playback starts only after tap/click in a later step.

## Personal Media

| Type | Count | Destination |
|---|---|---|
| Photos | 102 | `public/assets/memories/photos/` |
| Videos | 27 | `public/assets/memories/videos/` |
| **Total personal media** | **129** | |

Source folder: `E:\Assets\Photos-3-001\`

**Important:** Personal photos and videos were copied only — they were **not converted, compressed, reformatted, resized, or otherwise modified**. Original filenames and formats were preserved.

## Summary Counts

| Category | Count |
|---|---|
| Design PNG assets | 36 |
| Design video (final) | 1 |
| Music files | 2 |
| Font files | 4 |
| Personal photos | 102 |
| Personal videos | 27 |
| **Total files in `public/assets/`** | **169** |

## Data Manifests Created

- `src/data/siteInfo.js`
- `src/data/loveLetter.js`
- `src/data/assets.js`
- `src/data/mediaManifest.js`
- `src/data/curatedMedia.js` — deterministic curated subset for Step 4 sections
- `src/data/storySections.js` — section map documentation

## Curated Media (Step 4)

Only a **curated subset** of personal media is rendered on the website:

| | Total in manifest | Compatible (browser) | Rendered on site |
|---|---|---|---|
| Photos | 102 | 50 (.jpg/.jpeg/.png/.webp) | 25 |
| Videos | 27 | 25 (.mp4/.m4v) | 6 |

Personal media files remain **unmodified** on disk. Display uses `object-fit: cover` and CSS framing only.

### Web derivatives (generated, originals untouched)

The site renders **web-friendly JPG derivatives** — not raw HEIC/HEIF or motion clip files in the main UI.

| Folder | Purpose | Generator |
|---|---|---|
| `public/assets/memories/web/photos/` | JPG derivatives from curated HEIC/HEIF photos | `npm run generate:web-photos` |
| `public/assets/memories/web/motion-stills/` | Still frames from selected live-photo / motion clips | `npm run generate:motion-stills` |

- Original photos stay in `public/assets/memories/photos/`
- Original clips stay in `public/assets/memories/videos/`
- `curatedMedia.js` points `src` at derivatives and `originalSrc` at source files

### Video section removed

The former Video Moments player section was replaced by **Little Moments** — an image-led editorial section using motion stills and photos. The only remaining `<video>` in the main experience is the blended `birthday-cake-25.mp4` in the final section.

### Legacy video code removed (Step 5)

Removed from the active app (files deleted):

- `VideoCard.jsx`, `VideoMomentsSection.jsx`, `MediaCluster.jsx`
- `scripts/generate-video-posters.mjs`

The only `<video>` in the main scroll experience is `birthday-cake-25.mp4` in the final section.

### Music (Step 5)

| Track | File | Behavior |
|---|---|---|
| Happy birthday | `happy-birthday-song.m4a` | Starts after envelope seal tap |
| Special song | `special-song.mp3` | User taps gold seal in SpecialSongSection |

Managed by `src/hooks/useMusicManager.js`.

Distribution:

- Hero: 1 photo
- Birthday identity: 2 photos
- Since: 3 photos
- Memories: 8 images (1 featured + 7 mosaic)
- Little Moments: 6 images (5 motion stills + 1 photo)
- Letter: 1 photo
- Special song: 1 photo
- Final: 3 photos
