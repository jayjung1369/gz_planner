# JavaScript structure — Sprint 1-2

- `state.js`: shared application data, DOM references and mutable state
- `modules/utils.js`: date/time, formatting, clipboard and common helpers
- `modules/image-loader.js`: image fallback handling
- `modules/data.js`: JSON loading and data initialization
- `modules/planner.js`: schedule generation, rendering, editing and drag/drop
- `modules/travel.js`: Travel library and filtering
- `modules/guide.js`: China travel guide
- `modules/detail.js`: place/restaurant detail modal and gallery
- `modules/storage.js`: localStorage save/restore and serialization
- `modules/share.js`: share URL, Web Share and print/PDF
- `modules/events.js`: centralized event wiring
- `app.js`: startup only

Sprint 1-2 intentionally uses classic scripts. This preserves the existing
shared global state while making each feature independently maintainable.
