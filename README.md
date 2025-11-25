# Brightnal's Concepts — README (Search Page & Notch Navigation)

## Overview
This README explains the **Search Page** and its **Notch Navigation Bar system** in Brightnal’s Concepts. The navigation bar is designed to mimic a curved-bottom iPhone tab bar. Each navigation item uses a `data-url` attribute to switch pages dynamically via JavaScript.

This page uses **HTML**, **CSS**, **JavaScript**, modular scripts, and inline SVG icons. It also includes custom fonts for a clean, modern aesthetic.

---

## Features
### ✅ Notch Navigation Bar
- Located at the bottom of the page (`<nav class="notchNavBar">`).
- Four items with `data-url` attributes:
  - **Explore** (`data-url="explore"`)
  - **Search** (`data-url="search"`)
  - **Bookmark** (`data-url="bookmark"`)
  - **Me** (`data-url="me"`)
- Each item includes an **SVG icon** and a `<span>` label.
- The active item is highlighted by default.
- The `Me` tab also includes an indicator element for notifications.

### ✅ Page Switching
- Clicking any item triggers your script to read its `data-url` and update the page accordingly.
- JS scripts involved:
  - `/frontend/search/search.js`
  - `/frontend/util/JS_SCRIPTS/handleClick_SwitchPg.js`
  - `/frontend/util/JS_SCRIPTS/linkTracker.js`
- `initNotchNav('.notchNavBar')` initializes event listeners and handles active states.

### ✅ Custom Fonts
- **Noto Sans** via Google Fonts
- **Cabinet Grotesk** via CDNFonts

### ✅ Clean Asset Structure
CSS is located at:
```
/frontend/search/search.css
```
Icons are inline SVGs using Lucide icon format.

---

## File Structure
```
project-root/
│
├── frontend/
│   ├── search/
│   │   ├── search.css
│   │   └── search.js
│   │
│   ├── util/
│   │   └── JS_SCRIPTS/
│   │       ├── handleClick_SwitchPg.js
│   │       └── linkTracker.js
│   │
│   └── res/
│       └── file_00000000d5b47246a67fb09c50189192.png
│
└── search.html (This file)
```

---

## How Navigation Works
1. **Click Detection**
   - Each `<div>` inside `.notchNavBar` has a `data-url` attribute.
   - JS reads the value on click.

2. **Active State Handling**
   - Removes the `active` class from other items.
   - Adds `active` to the clicked item.
   - Updates SVG stroke color if needed.

3. **Page Switching**
   - `handleClick_SwitchPg.js` uses `data-url` values to load the appropriate page or section.

---

## How to Modify
- **Add a new tab:** Duplicate a nav item and update `data-url`.
- **Change icons:** Replace inline SVG paths.
- **Change fonts:** Update `<link>` tags in `<head>`.
- **Change styling:** Edit `/frontend/search/search.css`.

---

## Hosting
The page works on any static hosting platform:
- Render
- Cloudflare Pages
- Netlify
- Vercel

Upload the entire `frontend` folder and the HTML file.

---

## Credits
- Navigation UI: **Brightnal**
- Icons: **Lucide**
- Fonts: **Google Fonts** & **CDNFonts**

---

## License
This navigation system is free for personal or commercial use unless otherwise stated.

