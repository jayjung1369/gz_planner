# Sprint 1-1 — Foundation structure

- Split the legacy stylesheet into ordered files under `css/`.
- Moved the production JavaScript entry from `script.js` to `js/app.js`.
- Added `js/modules/` extraction targets for Sprint 1-2.
- Preserved CSS cascade order and existing runtime behavior.
- Archived V25 root assets under `legacy/` for rollback.
- Added cache-busting `?v=26` references for GitHub Pages.

## Runtime files

```text
index.html
css/
  base.css
  layout.css
  planner.css
  detail.css
  drag.css
  guide.css
  planner-cards.css
  travel.css
  mobile.css
js/
  app.js
  modules/
```
