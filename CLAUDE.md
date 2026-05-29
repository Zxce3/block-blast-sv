# Block Blast Clone — SvelteKit 5

## Project Overview

A browser-based **Block Blast** puzzle clone built with **SvelteKit 5** (Runes API).
Players drag tetromino-style pieces onto an 8×8 grid, clearing rows/columns when filled.
No time limit, no lives — pure score chasing, addictive loop.

---

## Actual Project Setup

```json
{
  "name": "block-blast-sv",
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.10",
    "@sveltejs/kit": "^2.57.0",
    "@sveltejs/vite-plugin-svelte": "^7.0.0",
    "@tailwindcss/forms": "^0.5.11",
    "@tailwindcss/typography": "^0.5.19",
    "@tailwindcss/vite": "^4.2.2",
    "svelte": "^5.55.2",
    "svelte-check": "^4.4.6",
    "tailwindcss": "^4.2.2",
    "typescript": "^6.0.2",
    "vite": "^8.0.7"
  }
}
```

**Package manager: `bun`**
**Adapter: `@sveltejs/adapter-static`** (already configured)
**Tailwind v4** with `@tailwindcss/vite` plugin (already wired into vite.config.ts)
**Plugins already installed:** `@tailwindcss/forms`, `@tailwindcss/typography`

Do NOT re-scaffold, re-install, or change the adapter. Work within this setup.

---

## Tech Stack

| Layer       | Choice                                                      |
|-------------|-------------------------------------------------------------|
| Framework   | SvelteKit 5 — Runes only (`$state`, `$derived`, `$effect`) |
| Styling     | Tailwind CSS v4 (already installed via `@tailwindcss/vite`) |
| Animations  | CSS transitions + keyframes (no external animation libs)    |
| Persistence | `localStorage` (high score, games played)                   |
| Build       | Vite 8 / bun                                                |
| Deploy      | adapter-static (already configured)                         |

---

## Directory Structure

```
src/
├── lib/
│   ├── game/
│   │   ├── pieces.ts             # Shape definitions + weighted random generator
│   │   ├── board.svelte.ts       # Board state, placement, clear logic
│   │   ├── score.svelte.ts       # Score, multiplier, streak, localStorage
│   │   └── generator.ts         # Piece queue helpers
│   ├── components/
│   │   ├── Board.svelte          # 8×8 grid render + drop/touch zones
│   │   ├── Cell.svelte           # Single cell — filled, preview, clearing states
│   │   ├── PieceTray.svelte      # 3-slot tray below the board
│   │   ├── DraggablePiece.svelte # Drag + touch floating clone
│   │   ├── ScoreDisplay.svelte   # Animated score + high score
│   │   └── GameOver.svelte       # Game-over overlay with restart
│   └── stores/
│       └── game.svelte.ts        # Unified top-level reactive game store
├── routes/
│   └── +page.svelte              # Main page shell
└── app.css                       # CSS vars, global styles, Tailwind import
```

---

## SvelteKit 5 Runes — Strict Rules

- **ONLY Runes syntax.** No `writable()`, `readable()`, `derived()` from `svelte/store`.
- `$state()` for all reactive primitives and objects.
- `$derived()` for computed values — never manually track dependencies.
- `$effect()` for side effects (localStorage sync, DOM mutations after render).
- Props via `let { propName } = $props()` — never `export let`.
- Reactive classes in `.svelte.ts` files use `$state` fields directly (not stores).
- Event handlers: use `onclick`, `onmousedown` etc. (Svelte 5 style, no `on:click`).

---

## Game Rules

1. **Board**: 8 × 8 grid, flat array of 64, initially all empty (0).
2. **Piece Tray**: 3 pieces always visible. All 3 refill simultaneously when all are placed.
3. **Placement**: Drag piece onto board. Must fit — no overlap, no OOB.
4. **Clearing**: After each placement, detect ALL filled rows AND columns, clear simultaneously.
5. **Scoring**:
   - Each cell placed: **+1 pt**
   - Lines cleared: **+10 × lineCount** base
   - 2+ lines simultaneously: apply **×1.5** multiplier
   - 3+ lines simultaneously: apply **×2.0** multiplier
   - Streak (clear on consecutive placements): **+5 bonus per streak level**
6. **Game Over**: None of the 3 tray pieces can be legally placed anywhere.
7. No undo. No timer.

---

## Piece Definitions (18 total)

```
1×1   single dot
1×2   horizontal domino
2×1   vertical domino
1×3   horizontal tromino-I
3×1   vertical tromino-I
L     tromino-L  [[1,0],[1,0],[1,1]]
J     tromino-J  [[0,1],[0,1],[1,1]]
2×2   2×2 square
1×4   horizontal tetromino-I
4×1   vertical tetromino-I
T     tetromino-T
L4    tetromino-L
J4    tetromino-J
S     tetromino-S
Z     tetromino-Z
O     2×2 (alias, same as 2×2 — only define once)
3×3   3×3 full square
P     pentomino-P  [[1,1],[1,1],[1,0]]
```

Each piece has **one fixed color** from the palette — assigned at definition time, not random.

---

## Color Palette (CSS Custom Properties)

Define these in `app.css` inside `:root`:

```css
:root {
  --bg:           #0a0a14;
  --surface:      #12121f;
  --surface-2:    #1a1a2e;
  --cell-empty:   #16213e;
  --cell-border:  #0f172a;
  --text:         #e2e8f0;
  --text-muted:   #64748b;

  --piece-red:    #f43f5e;
  --piece-orange: #f97316;
  --piece-yellow: #eab308;
  --piece-green:  #22c55e;
  --piece-teal:   #14b8a6;
  --piece-blue:   #3b82f6;
  --piece-indigo: #6366f1;
  --piece-purple: #a855f7;
  --piece-pink:   #ec4899;

  --glow-green:   0 0 12px rgba(34,197,94,0.5);
  --glow-red:     0 0 12px rgba(244,63,94,0.5);
}
```

---

## Board Data Model

```typescript
// Flat array — index = row * 8 + col
type BoardCells = number[]   // 0 = empty, positive int = piece color index
type ColorMap   = string[]   // parallel: CSS var string per cell e.g. 'var(--piece-teal)'

// Piece on board
interface PlaceResult {
  clearedRows: number[]   // 0-indexed row numbers
  clearedCols: number[]   // 0-indexed col numbers
}
```

`board.svelte.ts` exports a class or factory. The `place()` method writes cells AND returns
`PlaceResult` but does NOT clear yet — the Board component runs the CSS clear animation first
(200ms), then calls `board.clearLines(clearedRows, clearedCols)`.

---

## Drag & Drop Implementation

### Desktop (HTML5 Drag API)
- Piece `<div>` is `draggable="true"`.
- `dragstart`: set `dataTransfer` payload = tray slot index; call `game.startDrag(i)`.
- Board cells: `dragover` (preventDefault to allow drop), `drop` → `game.tryPlace(row, col)`.
- Ghost preview: on `dragenter` per cell, compute offset from piece origin, highlight cells.

### Mobile (Pointer Events — preferred over raw touch)
- Use `pointerdown`, `pointermove`, `pointerup` with `setPointerCapture`.
- On `pointerdown`: clone the piece element, attach to `document.body` at `position:fixed`.
- Move clone with `transform: translate(x, y)` tracking pointer.
- On `pointermove`: find cell under pointer via `document.elementFromPoint()`, update ghost.
- On `pointerup`: call `game.tryPlace(row, col)` if over a valid cell, else `game.cancelDrag()`.

### Ghost Preview
- Track which board cells the piece would occupy given the hovered cell as top-left anchor.
- Apply class `preview-valid` (green tint) or `preview-invalid` (red tint) to those cells.
- Clear preview on `dragleave` / pointer out.

---

## Animation Spec

| Event              | Target      | Animation                                      | Duration |
|--------------------|-------------|------------------------------------------------|----------|
| Cell placed        | Cell div    | `scale(0.6) → scale(1)` + opacity 0→1         | 80ms     |
| Row/col clearing   | Cell div    | Flash white → scale down → opacity 0           | 220ms    |
| Score increase     | Score span  | translateY(-4px) flash + color pulse           | 300ms    |
| Invalid drop       | Tray slot   | `@keyframes shake` (±6px, 3 cycles)            | 250ms    |
| Tray refill        | Each slot   | Scale 0→1, stagger 0 / 60 / 120ms             | 200ms    |
| Game over          | Overlay     | Slide up from bottom (translateY 100%→0)       | 350ms    |

All via CSS keyframes + class toggling. No JS timers inside components for animation timing
(use `animationend` event listener to clean up classes).

---

## localStorage Keys

```
blockblast_highscore    → number (string)
blockblast_played       → number (string)
```

Read on store init. Write inside `$effect` in `score.svelte.ts`.

---

## Performance Rules

- Board = flat `number[]` length 64. **No nested arrays or objects for cell state.**
- `colorMap` = parallel `string[]` length 64.
- `$derived` for `filledRows: number[]` and `filledCols: number[]`.
- Avoid reactive loops — `$effect` must not write to `$state` it reads.
- Use CSS classes for visual states, not inline style bindings (except piece colors).
- `{#each}` on board array uses index as key: `{#each cells as cell, i (i)}`.

---

## Constraints

- ❌ No Phaser, PIXI, or any game engine
- ❌ No Svelte 4 stores (`writable`, `readable`, `derived`)
- ❌ No `export let` in components
- ❌ No `any` TypeScript type
- ❌ No CDN imports at runtime
- ✅ `bun check` (runs `svelte-check`) must pass with zero errors
- ✅ Mobile-first: game area max 480px, centered on desktop
- ✅ Works at 375px viewport (no horizontal scroll)
- ✅ `adapter-static` compatible (no server routes, no SSR data)

---

## Commands

```bash
bun run dev        # dev server
bun run build      # static build
bun run preview    # preview built output
bun run check      # TypeScript + Svelte type check
```

---

## Definition of Done

- [ ] 8×8 board renders with correct colors
- [ ] All 18 pieces defined with fixed colors
- [ ] 3-piece tray always populated
- [ ] Drag & drop works — desktop and mobile
- [ ] Ghost preview: valid (green) / invalid (red)
- [ ] Piece returns to tray on invalid drop with shake
- [ ] Rows AND columns clear simultaneously after placement
- [ ] Score: placement pts + line bonus + multiplier
- [ ] Streak bonus active
- [ ] High score persists across sessions
- [ ] Tray refills when all 3 placed
- [ ] Game over triggers when no piece fits
- [ ] Game over overlay shows score + restart
- [ ] All animations from spec implemented
- [ ] 375px layout — no overflow
- [ ] `bun run check` → zero errors