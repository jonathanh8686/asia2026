# asia2026

Trip site for Vietnam, November 19–28, 2026 — Ho Chi Minh City → Ninh Binh → Hanoi.

Static site, no build step. Deploy by serving this folder directly (e.g. `nginx`, `caddy`, GitHub Pages, or any static host).

## Structure

- `index.html` — trip hub: countdown, route map, to-do checklist, links
- `itinerary.html` — day-by-day itinerary
- `housing.html` — housing placeholders for HCMC and Hanoi (not booked yet)
- `css/style.css` — shared styles
- `js/main.js` — countdown timer
- `js/map.js` — Leaflet route map

## Local preview

```
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
