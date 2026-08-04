# asia2026

Trip site for Vietnam, November 19–28, 2026 — Ho Chi Minh City → Ninh Binh → Hanoi.

Static site, no build step. Deploy by serving this folder directly (e.g. `nginx`, `caddy`, GitHub Pages, or any static host).

## Structure

- `index.html` — trip hub: countdown, route overview, to-do checklist, links
- `itinerary.html` — day-by-day itinerary
- `budget.html` — shared expense tracker (saved in the browser via `localStorage`)
- `css/style.css` — shared styles
- `js/main.js` — countdown timer
- `js/budget.js` — expense tracker logic

## Local preview

```
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
