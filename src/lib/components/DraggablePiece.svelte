<script lang="ts">
  import { game } from '#lib/stores/game.svelte.ts'
  import type { Piece } from '#lib/game/pieces.ts'

  let { piece, slotIndex }: { piece: Piece; slotIndex: number } = $props()

  let shaking = $state(false)

  const CELL = 28

  function grabOffset(e: { clientX: number; clientY: number }, target: HTMLElement) {
    const rect = target.getBoundingClientRect()
    const relX  = e.clientX - rect.left
    const relY  = e.clientY - rect.top
    const col   = Math.max(0, Math.min(piece.shape[0].length - 1, Math.floor(relX / CELL)))
    const row   = Math.max(0, Math.min(piece.shape.length    - 1, Math.floor(relY / CELL)))
    return { row, col }
  }

  function shake() {
    shaking = false
    requestAnimationFrame(() => { shaking = true })
  }

  // ── Desktop drag ──────────────────────────────────────────────────────────

  function ondragstart(e: DragEvent): void {
    const { row, col } = grabOffset(e, e.currentTarget as HTMLElement)
    game.startDrag(slotIndex, row, col)
    e.dataTransfer?.setData('text/plain', String(slotIndex))
  }

  function ondragend(): void {
    if (game.dragging !== null) {
      game.cancelDrag()
      shake()
    }
  }

  // ── Mobile pointer drag ───────────────────────────────────────────────────

  let clone: HTMLElement | null = null

  function onpointerdown(e: PointerEvent): void {
    // Mouse uses the HTML5 drag API; pointer events handle touch and pen.
    if (e.pointerType === 'mouse') return
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    const { row, col } = grabOffset(e, e.currentTarget as HTMLElement)
    game.startDrag(slotIndex, row, col)

    clone = (e.currentTarget as HTMLElement).cloneNode(true) as HTMLElement
    clone.style.cssText = `
      position: fixed; pointer-events: none; opacity: 0.9; z-index: 9999;
      left: 0; top: 0;
      transform: ${cloneTransform(e.clientX, e.clientY, row, col)};
    `
    document.body.appendChild(clone)

    window.addEventListener('pointermove', onwindowpointermove)
    window.addEventListener('pointerup', onwindowpointerup, { once: true })
    window.addEventListener('pointercancel', onwindowpointerup, { once: true })
  }

  function cloneTransform(cx: number, cy: number, oRow: number, oCol: number): string {
    const x = cx - (oCol + 0.5) * CELL
    const y = cy - (oRow + 0.5) * CELL
    return `translate(${x}px, ${y}px)`
  }

  function onwindowpointermove(e: PointerEvent): void {
    if (!clone) return
    const { row, col } = game.dragOffset
    clone.style.transform = cloneTransform(e.clientX, e.clientY, row, col)
  }

  function onwindowpointerup(): void {
    window.removeEventListener('pointermove', onwindowpointermove)
    window.removeEventListener('pointerup', onwindowpointerup)
    window.removeEventListener('pointercancel', onwindowpointerup)
    if (clone) { clone.remove(); clone = null }
    if (game.dragging !== null) {
      game.cancelDrag()
      shake()
    }
  }
</script>

<div
  class="piece-wrap cursor-grab active:cursor-grabbing select-none touch-none"
  class:animate-shake={shaking}
  draggable="true"
  role="button"
  tabindex="0"
  aria-label="Piece {piece.id}"
  {ondragstart}
  {ondragend}
  {onpointerdown}
  onanimationend={() => { shaking = false }}
>
  {#each piece.shape as row}
    <div class="flex">
      {#each row as cell}
        <div
          class="rounded-[2px]"
          style="
            width: {CELL}px;
            height: {CELL}px;
            background-color: {cell ? piece.colorVar : 'transparent'};
            {cell ? 'box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);' : ''}
          "
        ></div>
      {/each}
    </div>
  {/each}
</div>
