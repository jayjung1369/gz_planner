# Sprint 1-2 — JavaScript functional split

- reduced `js/app.js` to startup logic only
- moved shared state and DOM references to `js/state.js`
- separated planner, Travel, guide, detail, storage, share, data, events,
  utilities and image fallback behavior into `js/modules/`
- added explicit dependency order to `index.html`
- preserved existing CSS, data, images and browser behavior
- kept classic-script compatibility for GitHub Pages and current global state
- validated each JavaScript file independently with Node syntax checking
