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
