<script lang="ts">
  import { game } from '#lib/stores/game.svelte.ts'
  import StreakMeter from './StreakMeter.svelte'

  let bumping = $state(false)
  let prev    = $state(game.score.value)

  $effect(() => {
    const v = game.score.value
    if (v !== prev) {
      prev    = v
      bumping = false
      requestAnimationFrame(() => { bumping = true })
    }
  })

  const displayHigh = $derived(Math.max(game.score.high, game.stats.stats.bestScore))
</script>

<div class="flex items-center justify-between px-1 py-2 select-none">
  <!-- Level badge -->
  <div class="flex flex-col items-center min-w-[3rem]">
    <div class="text-[10px] tracking-widest" style="color: var(--text-muted);">LVL</div>
    <div class="text-xl font-bold" style="font-family:'Space Mono',monospace; color: var(--piece-indigo);">
      {game.level}
    </div>
  </div>

  <!-- Current score + streak -->
  <div class="flex flex-col items-center flex-1 gap-0.5">
    <div
      class="text-4xl font-bold"
      class:animate-score-bump={bumping}
      style="font-family:'Space Mono',monospace;"
      onanimationend={() => { bumping = false }}
    >
      {game.score.value.toLocaleString()}
    </div>
    <StreakMeter />
  </div>

  <!-- Best score -->
  <div class="flex flex-col items-center min-w-[3rem]">
    <div class="text-[10px] tracking-widest" style="color: var(--text-muted);">BEST</div>
    <div class="text-lg font-bold" style="font-family:'Space Mono',monospace; color: var(--piece-yellow);">
      {displayHigh.toLocaleString()}
    </div>
  </div>
</div>
