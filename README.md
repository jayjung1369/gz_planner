# Wedding Schedule


## Data note

- Places may change operating hours, admission rules, reservation policies, or prices.
- Verify time-sensitive information before visiting.
- Records marked as “추후 업데이트” are planning placeholders rather than confirmed businesses.


## Data architecture

- `data/places.json`: tourist attractions
- `data/restaurants.json`: restaurant categories and candidates
- `data/photos.json`: local image paths
- `data/scheduleRules.json`: route and recommendation rules
- `ADMIN_GUIDE.md`: Korean admin editing guide

Run locally with Live Server because browsers block JSON fetch from `file://` URLs.


## Sprint 1-1 structure

Production CSS now lives in `css/`, and the JavaScript entry is `js/app.js`. The `legacy/` folder is rollback-only and is not loaded by the page.


## Sprint 1-2

Sprint 1-2 includes Sprint 1-1 and can be deployed directly. JavaScript is now
separated by responsibility, while `js/app.js` only starts the application.


## Sprint 1-3

Lists and itinerary cards use WebP thumbnails from `images/thumb/`.
Full-size WebP images in `images/full/` are loaded only in detail views.
The Travel library displays six cards at first and progressively loads more.


## Sprint 2-1

Mobile itinerary cards now use strict width constraints and safe long-text
clamping. Mobile card actions are available through a bottom sheet. The
`tests/mobile-card-fixture.html` page contains deliberately long labels and an
automatic horizontal-overflow report.
