# Sprint 1-3 — Image and Travel performance

- generated `23` optimized raster image sets
- added `images/thumb/` WebP files for lists and schedule cards
- added `images/full/` WebP files for detail galleries
- added `data/imageManifest.json`
- Travel initially renders 6 cards
- additional cards load in batches of 6
- IntersectionObserver loads more cards near the bottom
- a manual `더 보기` button remains available
- card images use true IntersectionObserver lazy loading
- detail pages load full images only when opened
- image skeleton and fade-in states added
- failed images immediately fall back to the local SVG placeholder

## Image size summary

- original raster total: 11.60 MB
- thumbnail WebP total: 0.45 MB
- full WebP total: 4.21 MB
