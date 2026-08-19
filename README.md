# Birthday surprise — plain HTML / CSS / JavaScript version

The same website as the React app in the repository root, rewritten with nothing but
HTML, CSS and vanilla JavaScript. **No Node, no npm, no build step.**

## How to open it

Double-click `index.html` — it opens straight in any browser (works from `file://`).

Optionally serve it locally instead (nicer URLs, needed if you add audio in some browsers):

```bash
cd static
python3 -m http.server 8000
# then open http://localhost:8000
```

To publish it, upload the whole `static/` folder to any static host
(GitHub Pages, Netlify, Vercel, or plain shared hosting).

## Pages

| File                 | Page                                     |
| -------------------- | ---------------------------------------- |
| `index.html`         | Birthday welcome (confetti + cake)       |
| `memories.html`      | Photo gallery with lightbox              |
| `birthday-wish.html` | Birthday message with typing animation   |
| `apology.html`       | A small apology                          |
| `404.html`           | Friendly not-found page (for hosts that use it) |

## Editing the content

Everything you are meant to change lives in `assets/js/site-data.js`:
photo files and captions, the birthday message, the apology text and the footer line.

## Photos

Replace `images/photo1.jpg` … `photo5.jpg` with your own pictures, keeping the same
file names. Portrait pictures look best. If a file is missing, the card shows an
elegant placeholder instead of a broken image.

## Music

Nothing ever plays automatically. Put an audio file at `audio/birthday.mp3` and a small
play/pause button appears in the bottom-left corner. Without that file the button stays
hidden.

## Notes

- Responsive for mobile, tablet and desktop.
- Keyboard accessible: skip link, focus rings, and the lightbox supports `Esc` / `←` / `→`.
- Respects `prefers-reduced-motion` — animations are disabled for visitors who ask for it.
