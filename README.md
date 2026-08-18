# antonia.dev

My personal site — CV, projects, and a little lofi player. Built with plain HTML, CSS, and JavaScript, no framework, no build step.

Live at [antoniapopovici.github.io](https://antoniapopovici.github.io).

## Running locally

```
python3 -m http.server 8000
```

then open `localhost:8000`.

## Structure

- `index.html` — all the content, split into tabs (Home, CV, Projects)
- `css/style.css` — styling
- `js/main.js` — tab switching, lightbox, music widget
- `cv/` — CV source (`.tex`) and the compiled PDF
