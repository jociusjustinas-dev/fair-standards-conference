# Fair Standards, Global Impact — landing page prototype

Static HTML/CSS/JS prototype for the 17 November 2026 Fair Standards Alliance conference. Built to match the live [fair-standards.org](https://fair-standards.org/) wamvite theme.

## View locally

From this folder:

```bash
python3 -m http.server 8765
```

Then open [http://localhost:8765](http://localhost:8765).

Fonts and the hero texture load from the live theme, so you need a network connection. Logos and `object.svg` are local.

## Files

| Path | Role |
|---|---|
| `index.html` | Conference page |
| `css/wamvite.css` | Exact compiled theme CSS from fair-standards.org |
| `css/conference.css` | Accordion/agenda extras only |
| `js/main.js` | Sticky header contrast, mobile nav, panel accordion |
| `assets/` | Logo, favicon, object graphic |
| `DESIGN-SYSTEM.md` | Colour, type, layout, and component notes for WordPress integration |

## Handoff

Use the existing WordPress header/footer partials. This prototype reconstructs them so the page can be reviewed standalone. Registration buttons are placeholders (`<!-- TODO: replace with real registration link -->`).
