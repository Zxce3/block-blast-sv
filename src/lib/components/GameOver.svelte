<script lang="ts">
  import { game } from '$lib/stores/game.svelte'

  const isNewBest = $derived(
    game.score.value > 0 &&
    game.score.value >= game.stats.stats.bestScore
  )
</script>

{#if game.isOver}
  <div
    class="fixed inset-0 flex items-end justify-center z-50 pb-4 px-4"
    style="background: rgba(10,10,20,0.88); backdrop-filter: blur(6px);"
  >
    <div
      class="animate-slide-up flex flex-col items-center gap-4 rounded-2xl p-6 w-full overflow-y-auto"
      style="
        max-width: 420px;
        max-height: 90dvh;
        background: var(--surface);
        border: 1px solid var(--piece-red);
        box-shadow: var(--glow-red), 0 0 48px rgba(244,63,94,0.18);
      "
    >
      <h2 class="text-3xl font-bold tracking-widest mt-1" style="color: var(--piece-red); font-family:'Space Mono',monospace;">
        GAME OVER
      </h2>

      {#if isNewBest}
        <div class="text-xs tracking-widest px-3 py-1 rounded-full" style="background: rgba(234,179,8,0.15); color: var(--piece-yellow); font-family:'Space Mono',monospace;">
          NEW BEST!
        </div>
      {/if}

      <!-- Score pair -->
      <div class="flex gap-8 text-center">
        <div>
          <div class="text-3xl font-bold" style="font-family:'Space Mono',monospace;">
            {game.score.value.toLocaleString()}
          </div>
          <div class="text-xs tracking-widest" style="color: var(--text-muted);">SCORE</div>
        </div>
        <div style="width: 1px; background: var(--surface-2);"></div>
        <div>
          <div class="text-3xl font-bold" style="font-family:'Space Mono',monospace; color: var(--piece-yellow);">
            {Math.max(game.score.high, game.stats.stats.bestScore).toLocaleString()}
          </div>
          <div class="text-xs tracking-widest" style="color: var(--text-muted);">BEST</div>
        </div>
      </div>

      <!-- Round stats -->
      <div class="w-full grid grid-cols-3 gap-2 rounded-xl p-3" style="background: var(--surface-2);">
        <div class="text-center">
          <div class="text-xl font-bold" style="font-family:'Space Mono',monospace; color: var(--piece-teal);">
            {game.score.linesCleared}
          </div>
          <div class="text-[10px] tracking-wider" style="color: var(--text-muted);">LINES</div>
        </div>
        <div class="text-center">
          <div class="text-xl font-bold" style="font-family:'Space Mono',monospace; color: var(--piece-orange);">
            {game.score.bestStreak}
          </div>
          <div class="text-[10px] tracking-wider" style="color: var(--text-muted);">STREAK</div>
        </div>
        <div class="text-center">
          <div class="text-xl font-bold" style="font-family:'Space Mono',monospace; color: var(--piece-indigo);">
            {game.level}
          </div>
          <div class="text-[10px] tracking-wider" style="color: var(--text-muted);">LEVEL</div>
        </div>
      </div>

      <!-- Leaderboard -->
      {#if game.stats.scores.length > 0}
        <div class="w-full">
          <div class="text-[10px] tracking-widest text-center mb-2" style="color: var(--text-muted);">LEADERBOARD</div>
          {#each game.stats.scores as entry, i}
            <div
              class="flex items-center justify-between px-2 py-1.5 rounded-lg"
              style="background: {i === 0 ? 'rgba(234,179,8,0.07)' : 'transparent'};"
            >
              <div class="flex items-center gap-2">
                <span class="text-xs w-5 font-bold" style="font-family:'Space Mono',monospace; color: {i === 0 ? 'var(--piece-yellow)' : 'var(--text-muted)'};">
                  #{i + 1}
                </span>
                <span class="font-bold text-sm" style="font-family:'Space Mono',monospace; color: {i === 0 ? 'var(--piece-yellow)' : 'var(--text)'};">
                  {entry.score.toLocaleString()}
                </span>
              </div>
              <div class="flex gap-3 text-xs" style="color: var(--text-muted);">
                <span>LV.{entry.level}</span>
                <span>{entry.date}</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Action buttons -->
      <div class="flex gap-3 w-full mt-1">
        <button
          class="flex-1 py-3 rounded-xl font-bold text-sm tracking-widest transition-all duration-150 hover:scale-105 active:scale-95"
          style="background: var(--surface-2); color: var(--text-muted); font-family:'Space Mono',monospace;"
          onclick={() => game.goToMenu()}
        >
          MENU
        </button>
        <button
          class="py-3 rounded-xl font-bold text-sm tracking-widest transition-all duration-150 hover:scale-105 active:scale-95"
          style="flex: 2; background: var(--piece-green); color: #000; font-family:'Space Mono',monospace; box-shadow: var(--glow-green);"
          onclick={() => game.newGame()}
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  </div>
{/if}
