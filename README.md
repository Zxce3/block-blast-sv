# Block Blast

A browser-based Block Blast puzzle clone built with SvelteKit 5 and Tailwind CSS v4.

Drag tetromino-style pieces onto an 8×8 grid. Fill rows or columns to clear them and score points. No timer, no lives — pure score chasing.

## Stack

| Layer | Choice |
|---|---|
| Framework | SvelteKit 5 — Runes only (`$state`, `$derived`, `$effect`) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Animations | CSS keyframes — no external animation libs |
| Persistence | `localStorage` |
| Build | Vite 8 / bun |
| Deploy | `adapter-static` |

## Features

- **18 pieces** with fixed colors, weighted random generation
- **Drag & drop** — HTML5 drag API on desktop, Pointer Events on mobile
- **Magnetic snap** — pieces anchor to where you grabbed them and snap to board edges
- **Ghost preview** — green (valid) / red (invalid) highlight before dropping
- **Line clears** — rows and columns clear simultaneously after each placement
- **Scoring** — placement points + line bonuses + 1.5× / 2× multipliers for multi-clears
- **Streak system** — consecutive clears build a streak for bonus points; dot meter in the HUD
- **Level progression** — every 500 pts raises the level; piece difficulty scales up
- **Perfect clear bonus** — +500 pts for emptying the entire board
- **Floating notifications** — DOUBLE!, TRIPLE!, STREAK ×N, LEVEL N!, PERFECT CLEAR!
- **Board flash** — white flash on 2+ simultaneous line clears
- **Landing screen** — animated title, decorative board preview, stats, leaderboard
- **Game over overlay** — round stats (lines, streak, level) + top-5 leaderboard
- **Persistent stats** — best score, games played, best streak, total lines (localStorage)
- **Mobile-first** — works at 375px, no horizontal scroll

## Commands

```bash
bun install          # install dependencies
bun run dev          # dev server at localhost:5173
bun run build        # static build → build/
bun run preview      # preview the build
bun run check        # TypeScript + Svelte type check
```

## Project Structure

```
src/
├── lib/
│   ├── game/
│   │   ├── pieces.ts           # 18 piece definitions + weighted random generator
│   │   ├── board.svelte.ts     # Board state, placement, clear logic
│   │   ├── score.svelte.ts     # Score, multiplier, streak, localStorage
│   │   └── stats.svelte.ts     # Leaderboard + lifetime stats
│   ├── components/
│   │   ├── Board.svelte        # 8×8 grid, drag/drop/pointer events, flash
│   │   ├── Cell.svelte         # Single cell — filled, preview, clearing states
│   │   ├── DraggablePiece.svelte  # Drag + touch floating clone, grab-offset
│   │   ├── PieceTray.svelte    # 3-slot tray, staggered pop-in on refill
│   │   ├── ScoreDisplay.svelte # Score, level badge, streak meter
│   │   ├── StreakMeter.svelte  # Dot row showing current streak
│   │   ├── Notifications.svelte  # Floating feedback text overlay
│   │   ├── GameOver.svelte     # Game-over overlay, leaderboard, restart
│   │   └── Landing.svelte      # Start screen with stats and leaderboard
│   └── stores/
│       └── game.svelte.ts      # Unified reactive game store (singleton)
├── routes/
│   ├── +page.svelte            # Main page shell
│   └── +page.ts                # ssr = false (client-only)
└── app.css                     # CSS vars, global styles, keyframe animations
```
