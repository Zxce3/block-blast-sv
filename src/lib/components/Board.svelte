<script lang="ts">
  import Cell from './Cell.svelte'
  import { game } from '$lib/stores/game.svelte'

  let previewCells  = $state<Map<number, 'valid' | 'invalid'>>(new Map())
  let clearingCells = $state<Set<number>>(new Set())
  let flashing      = $state(false)

  function getCellIndex(el: Element | null): number {
    if (!el) return -1
    const idx = (el as HTMLElement).dataset.idx
    if (idx !== undefined) return parseInt(idx, 10)
    if (el.parentElement) return getCellIndex(el.parentElement)
    return -1
  }

  function getRowCol(idx: number): [number, number] {
    return [Math.floor(idx / 8), idx % 8]
  }

  /** Compute the magnetic anchor: apply grab offset then clamp inside the board. */
  function magnetAnchor(cellIdx: number, piece: { shape: number[][] }): [number, number] {
    const [hRow, hCol] = getRowCol(cellIdx)
    const pieceH = piece.shape.length
    const pieceW = Math.max(...piece.shape.map(r => r.length))
    const row = Math.max(0, Math.min(8 - pieceH, hRow - game.dragOffset.row))
    const col = Math.max(0, Math.min(8 - pieceW, hCol - game.dragOffset.col))
    return [row, col]
  }

  function updatePreview(cellIdx: number): void {
    if (game.dragging === null) { previewCells = new Map(); return }
    const piece = game.tray[game.dragging]
    if (!piece) { previewCells = new Map(); return }

    const [row, col] = magnetAnchor(cellIdx, piece)
    const map = new Map<number, 'valid' | 'invalid'>()
    let allValid = true

    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] === 0) continue
        const br = row + r
        const bc = col + c
        // Strict bounds check — no wrap-around index tricks
        if (br < 0 || br >= 8 || bc < 0 || bc >= 8) { allValid = false; continue }
        if (game.board.cells[br * 8 + bc] !== 0) allValid = false
        map.set(br * 8 + bc, 'valid')
      }
    }

    if (!allValid) for (const k of map.keys()) map.set(k, 'invalid')
    previewCells = map
  }

  async function doPlace(cellIdx: number): Promise<void> {
    if (cellIdx < 0 || game.dragging === null) return
    const piece = game.tray[game.dragging]
    if (!piece) return

    const [row, col] = magnetAnchor(cellIdx, piece)
    previewCells = new Map()

    const result = game.tryPlace(row, col)
    if (!result) return

    const totalLines = result.clearedRows.length + result.clearedCols.length
    if (totalLines === 0) return

    const clearing = new Set<number>()
    for (const r of result.clearedRows)  for (let c = 0; c < 8; c++) clearing.add(r * 8 + c)
    for (const c of result.clearedCols)  for (let r = 0; r < 8; r++) clearing.add(r * 8 + c)
    clearingCells = clearing

    await new Promise(res => setTimeout(res, 220))
    game.board.clearLines(result.clearedRows, result.clearedCols)
    clearingCells = new Set()

    game.checkPerfectClear()
    if (totalLines >= 2) flashing = true
  }

  function ondragover(e: DragEvent): void {
    e.preventDefault()
    const idx = getCellIndex(e.target as Element)
    if (idx >= 0) updatePreview(idx)
  }

  function ondrop(e: DragEvent): void {
    e.preventDefault()
    doPlace(getCellIndex(e.target as Element))
  }

  function ondragleave(e: DragEvent): void {
    const rel = e.relatedTarget as Element | null
    if (rel && (e.currentTarget as Element).contains(rel)) return
    previewCells = new Map()
  }

  let pointerCellIdx = $state(-1)

  function onpointermove(e: PointerEvent): void {
    if (game.dragging === null) return
    const idx = getCellIndex(document.elementFromPoint(e.clientX, e.clientY))
    if (idx !== pointerCellIdx) { pointerCellIdx = idx; updatePreview(idx) }
  }

  function onpointerup(e: PointerEvent): void {
    if (game.dragging === null) return
    doPlace(getCellIndex(document.elementFromPoint(e.clientX, e.clientY)))
    pointerCellIdx = -1
  }
</script>

<div class="relative w-full">
  <div
    class="grid grid-cols-8 gap-0.5 w-full touch-none select-none"
    role="grid"
    tabindex="0"
    aria-label="Game board"
    {ondragover}
    {ondrop}
    {ondragleave}
    {onpointermove}
    {onpointerup}
  >
    {#each game.board.cells as _cell, i (i)}
      <div data-idx={i} class="contents">
        <Cell
          filled={game.board.cells[i] !== 0}
          colorVar={game.board.colorMap[i]}
          preview={previewCells.get(i) ?? null}
          clearing={clearingCells.has(i)}
        />
      </div>
    {/each}
  </div>

  {#if flashing}
    <div
      class="absolute inset-0 pointer-events-none rounded-sm animate-board-flash"
      style="background: white;"
      onanimationend={() => { flashing = false }}
    ></div>
  {/if}
</div>
