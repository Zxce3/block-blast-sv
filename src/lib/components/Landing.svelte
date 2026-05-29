<script lang="ts">
  import { game } from '$lib/stores/game.svelte'

  // Hand-crafted decorative board pattern
  const DECO: string[] = [
    'var(--piece-blue)',   'var(--piece-blue)',   '',                    '',                    '',                    'var(--piece-red)',   'var(--piece-red)',   '',
    'var(--piece-blue)',   'var(--piece-blue)',   '',                    'var(--piece-green)',  'var(--piece-green)',  'var(--piece-red)',   'var(--piece-red)',   '',
    '',                   '',                    '',                    'var(--piece-green)',  'var(--piece-green)',  '',                   '',                   '',
    'var(--piece-yellow)', 'var(--piece-yellow)', 'var(--piece-yellow)', '',                    '',                    'var(--piece-teal)',  'var(--piece-teal)',  'var(--piece-teal)',
    '',                   '',                    '',                    'var(--piece-purple)', 'var(--piece-purple)', '',                   '',                   '',
    'var(--piece-orange)', '',                    '',                    'var(--piece-purple)', 'var(--piece-purple)', '',                   '',                   'var(--piece-pink)',
    'var(--piece-orange)', '',                    'var(--piece-indigo)', 'var(--piece-indigo)', '',                    '',                   'var(--piece-pink)',  'var(--piece-pink)',
    'var(--piece-orange)', '',                    'var(--piece-indigo)', 'var(--piece-indigo)', '',                    '',                   '',                   'var(--piece-pink)',
  ]

  const hasStats  = $derived(game.stats.stats.gamesPlayed > 0)
  const hasScores = $derived(game.stats.scores.length > 0)
</script>

<main class="flex min-h-dvh items-start justify-center px-4 py-8 overflow-x-hidden">
  <div class="flex flex-col items-center w-full gap-5" style="max-width: 420px;">

    <!-- Title -->
    <div class="text-center select-none animate-landing-float">
      <h1 class="text-5xl font-bold tracking-tighter" style="
        font-family: 'Space Mono', monospace;
        background: linear-gradient(135deg, var(--piece-indigo) 0%, var(--piece-pink) 50%, var(--piece-orange) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(0 0 24px rgba(99,102,241,0.55));
      ">BLOCK BLAST</h1>
      <p class="text-xs tracking-widest mt-1" style="color: var(--text-muted);">fill rows & columns · score big</p>
    </div>

    <!-- Decorative mini board -->
    <div class="grid grid-cols-8 gap-0.5 w-56 select-none" style="opacity: 0.8;">
      {#each DECO as color}
        <div
          class="aspect-square rounded-xs"
          style="
            background-color: {color || 'var(--cell-empty)'};
            border: 1px solid {color ? 'rgba(255,255,255,0.12)' : 'var(--cell-border)'};
            {color ? `box-shadow: 0 0 4px ${color}40;` : ''}
          "
        ></div>
      {/each}
    </div>

    <!-- Stats row (only if played before) -->
    {#if hasStats}
      <div class="flex gap-6 text-center select-none">
        <div>
          <div class="text-2xl font-bold" style="font-family:'Space Mono',monospace; color: var(--piece-yellow);">
            {game.stats.stats.bestScore.toLocaleString()}
          </div>
          <div class="text-xs tracking-widest" style="color: var(--text-muted);">BEST</div>
        </div>
        <div style="width: 1px; background: var(--surface-2);"></div>
        <div>
          <div class="text-2xl font-bold" style="font-family:'Space Mono',monospace;">
            {game.stats.stats.gamesPlayed}
          </div>
          <div class="text-xs tracking-widest" style="color: var(--text-muted);">GAMES</div>
        </div>
        <div style="width: 1px; background: var(--surface-2);"></div>
        <div>
          <div class="text-2xl font-bold" style="font-family:'Space Mono',monospace; color: var(--piece-orange);">
            {game.stats.stats.bestStreak}
          </div>
          <div class="text-xs tracking-widest" style="color: var(--text-muted);">STREAK</div>
        </div>
      </div>
    {/if}

    <!-- Play button -->
    <button
      class="px-12 py-4 rounded-2xl font-bold text-xl tracking-widest transition-all duration-150 hover:scale-105 active:scale-95"
      style="
        font-family: 'Space Mono', monospace;
        background: linear-gradient(135deg, var(--piece-indigo), var(--piece-purple));
        color: #fff;
        box-shadow: 0 0 32px rgba(99,102,241,0.5), 0 4px 24px rgba(0,0,0,0.5);
      "
      onclick={() => game.startGame()}
    >
      {hasStats ? 'PLAY' : 'PLAY'}
    </button>

    <!-- Leaderboard -->
    {#if hasScores}
      <div class="w-full rounded-xl p-4 select-none" style="background: var(--surface);">
        <h3 class="text-xs tracking-widest text-center mb-3" style="color: var(--text-muted);">TOP SCORES</h3>
        <div class="flex flex-col gap-1">
          {#each game.stats.scores as entry, i}
            <div
              class="flex items-center justify-between px-2 py-1.5 rounded-lg"
              style="background: {i === 0 ? 'rgba(234,179,8,0.08)' : 'transparent'};"
            >
              <div class="flex items-center gap-3">
                <span
                  class="text-xs font-bold w-5"
                  style="font-family:'Space Mono',monospace; color: {i === 0 ? 'var(--piece-yellow)' : 'var(--text-muted)'};"
                >#{i + 1}</span>
                <span
                  class="font-bold"
                  style="font-family:'Space Mono',monospace; color: {i === 0 ? 'var(--piece-yellow)' : 'var(--text)'}; font-size: {i === 0 ? '1rem' : '0.875rem'};"
                >{entry.score.toLocaleString()}</span>
              </div>
              <div class="flex items-center gap-3 text-xs" style="color: var(--text-muted);">
                <span>LV.{entry.level}</span>
                <span>{entry.date}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- How to play -->
    <p class="text-xs text-center leading-relaxed" style="color: var(--text-muted); max-width: 260px;">
      Drag pieces onto the grid.<br>
      Fill a row <em>or</em> column to clear it.<br>
      Clear multiple lines for combo bonuses.
    </p>

  </div>
</main>
