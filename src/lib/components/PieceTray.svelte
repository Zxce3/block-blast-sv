<script lang="ts">
  import DraggablePiece from './DraggablePiece.svelte'
  import { game } from '$lib/stores/game.svelte'

  let popSlots = $state([false, false, false])
  let prevTrayWasEmpty = $state(false)

  $effect(() => {
    const allNull = game.tray.every(p => p === null)
    if (!allNull && prevTrayWasEmpty) {
      // tray just refilled — stagger pop-in
      popSlots = [false, false, false]
      setTimeout(() => { popSlots = [true, false, false] }, 0)
      setTimeout(() => { popSlots = [true, true, false] }, 60)
      setTimeout(() => { popSlots = [true, true, true] }, 120)
    }
    prevTrayWasEmpty = allNull
  })
</script>

<div class="flex items-center py-3">
  {#each game.tray as piece, i}
    <div
      class="flex-1 flex items-center justify-center min-h-20 overflow-hidden"
      class:animate-pop-in={popSlots[i]}
      onanimationend={() => { const p = [...popSlots]; p[i] = false; popSlots = p }}
    >
      {#if piece !== null}
        <DraggablePiece {piece} slotIndex={i} />
      {:else}
        <div class="w-14 h-14 rounded-lg opacity-20" style="background: var(--surface-2);"></div>
      {/if}
    </div>
  {/each}
</div>
