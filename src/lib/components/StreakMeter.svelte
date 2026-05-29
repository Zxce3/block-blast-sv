<script lang="ts">
  import { game } from '$lib/stores/game.svelte'

  const MAX_DOTS = 7

  const dots = $derived(
    Array.from({ length: Math.min(game.score.streak, MAX_DOTS) }, (_, i) => i)
  )

  const color = $derived(
    game.score.streak >= 6 ? 'var(--piece-red)'    :
    game.score.streak >= 4 ? 'var(--piece-orange)' :
    game.score.streak >= 2 ? 'var(--piece-yellow)' :
                              'var(--piece-teal)'
  )
</script>

{#if game.score.streak > 0}
  <div class="flex items-center gap-1.5 justify-center select-none">
    {#each dots as _}
      <div
        class="w-1.5 h-1.5 rounded-full transition-all duration-150"
        style="background-color: {color}; box-shadow: 0 0 5px {color};"
      ></div>
    {/each}
    {#if game.score.streak > MAX_DOTS}
      <span class="text-xs font-bold" style="color: {color}; font-family:'Space Mono',monospace;">
        +{game.score.streak - MAX_DOTS}
      </span>
    {/if}
    <span class="text-xs font-bold ml-0.5" style="color: {color}; font-family:'Space Mono',monospace;">
      ×{game.score.streak}
    </span>
  </div>
{/if}
