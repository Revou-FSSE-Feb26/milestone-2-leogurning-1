# LeonFun — Browser Gaming Platform

> A casual browser gaming platform built with HTML, Tailwind CSS, and Vanilla JavaScript (ES Modules).

---

## Overview

**LeonFun** is a multi-page gaming website designed for casual gamers who want to enjoy simple, entertaining browser-based games. The platform features a visually appealing landing page, three fully interactive JavaScript games, a contact form, and persistent leaderboards powered by `localStorage`.

---

## Project Structure

```
leonfun/
├── index.html                        # Main landing page
├── css/
│   └── style.css                     # Custom CSS (animations, game styles, theming)
├── js/
│   ├── utils.js                      # Shared ES module (localStorage, modal, leaderboard)
│   ├── main.js                       # Homepage interactions (nav, contact form, scroll reveal)
│   ├── rps.js                        # Rock Paper Scissors game logic
│   ├── avoid.js                      # Avoid Falling Objects game loop
│   └── guess.js                      # Number Guessing game logic
└── pages/
    ├── rock-paper-scissors.html      # RPS game page
    ├── avoid-falling-objects.html    # Avoid game page
    └── number-guessing.html          # Guess game page
├── README.md                         # Readme Documentation of the website
```

---

## Features Implemented

### Landing Page (`index.html`)

- Fixed navigation bar with scroll-shadow effect and mobile hamburger menu
- Hero section with gradient headline
- Three game cards with hover animations linking to each game page
- "How It Works" 3-step explainer section
- Contact form with full validation and modal feedback
- Footer with copyright, company name, and email

### Number Guessing (`games/number-guessing.html`)

- Random secret number (1–100) per round
- 5-attempt limit with a colour-coded progress bar (green → yellow → red)
- "Too High" / "Too Low" directional hints
- Guess history displayed as coloured tags (↑ / ↓ / ✓)
- Per-round result message with "New Round" button
- Leaderboard ranked by **total rounds won**

### Rock, Paper, Scissors (`games/rock-paper-scissors.html`)

<Explained later>

### Avoid Falling Objects (`games/avoid-falling-objects.html`)

<Explained later>

### Leaderboard & Profiles (all game pages)

- Nickname prompt before every game
- `localStorage` persistence across sessions and page reloads
- Best-score-only rule: an existing entry is only overwritten if the new score is strictly higher
- Top 10 players displayed, with the current player highlighted in yellow
- Medal emojis 🥇🥈🥉 for the top three spots

### Contact Form

- Fields: Name, Email (validated), Message (textarea)
- Empty-field check shows an error modal
- Successful submission logs data to console and shows a success modal
- Form resets after successful submission

---

## Technologies Used

| Technology                    | Purpose                                                 |
| ----------------------------- | ------------------------------------------------------- |
| **HTML5**                     | Semantic page structure                                 |
| **Tailwind CSS (CDN)**        | Utility-first styling, responsive layout, custom config |
| **Vanilla CSS** (`style.css`) | Custom animations, game-specific rules, CSS variables   |
| **JavaScript ES Modules**     | Game logic, shared utilities, clean code separation     |
| **Google Fonts**              | Fredoka One (display) + Nunito (body)                   |
| `localStorage`                | Score persistence across sessions                       |

---

## Design System

### Colour Palette (Pastel Theme)

### Typography

- **Fredoka One** — headings, scores, buttons
- **Nunito** — body text, labels, instructions

---

## Getting Started

1. **Download / clone** the project folder.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
3. No build step required — Tailwind CSS is loaded via CDN.

> ⚠️ **Note:** Because the game pages use `type="module"` JavaScript, they must be served over HTTP (not opened as `file://`). You can use any local server:
>
> ```bash
> # Node.js (npx)
> npx serve .
>
> Then visit `http://localhost:3000` in your browser.
>
> # VS Code
> Install the "Live Server" extension and click "Go Live"
> ```

---

## Contact

**LeonFun Gaming Company**  
Email: [admin@leonfun.com](mailto:admin@leonfun.com)

---

© 2026 LeonFun. All rights reserved.
