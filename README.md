# ashmi.design

Personal portfolio, static HTML/CSS/JS. No build step, no framework.

## Structure
```
index.html                # Homepage: sidebar + Work rows
AshmiR_Resume.pdf
assets/styles.css         # All shared styles (black and white tokens at the top)
assets/script.js          # Sidebar active state, lightbox, jump link
assets/img, assets/video
projects/nhance.html
projects/agentic-ai.html
```

## Design rules
- Black and white only. Colors live in `:root` in `styles.css`.
- Light mode only. The dark mode toggle was removed on purpose.
- No em dashes in copy. No animations beyond simple hover states.
- Never use inline `grid-template-columns` for responsive grids, use a modifier class in `styles.css`.

## Adding a case study
1. Copy `projects/nhance.html`, update title, hero, meta, and sections.
2. On `index.html`, change the matching "coming soon" `<div class="work-row is-soon">` into
   `<a class="work-row" href="projects/your-page.html">` with an `<img>` in `.work-img` in place of `.soon-panel`.
