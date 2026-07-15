# Next Steps

## Step 6 — Deployment

Step 6 will focus on:

- Production deployment (hosting, domain, HTTPS)
- Final device QA on real phones
- Optional performance pass (image lazy-load audit)

### Step 5 complete

- **Dual-track music** via `useMusicManager` — happy birthday after envelope, special song from SpecialSongSection
- **Floating music button** controls whichever track is active (gold = happy, rose = special)
- **Scroll reveal** via `[data-reveal]` + `useRevealObserver`
- **Final section** padding + `body.is-final-section` lifts music button above Seemon signature
- **Legacy video code removed** (VideoCard, VideoMomentsSection, generate-video-posters)

### Media scripts

```bash
npm run generate:web-photos
npm run generate:motion-stills
```

### Preserved

- Full-screen envelope gate
- Paginated love letter reader
- Image-led Little Moments section
- Final section with blended `birthday-cake-25.mp4`
- Debug screen (`?debug=assets`)
