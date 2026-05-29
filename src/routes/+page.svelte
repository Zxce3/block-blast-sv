<script lang="ts">
  import Board from '$lib/components/Board.svelte'
  import PieceTray from '$lib/components/PieceTray.svelte'
  import ScoreDisplay from '$lib/components/ScoreDisplay.svelte'
  import GameOver from '$lib/components/GameOver.svelte'
  import Landing from '$lib/components/Landing.svelte'
  import Notifications from '$lib/components/Notifications.svelte'
  import { game } from '$lib/stores/game.svelte'
</script>

<svelte:head>
  <title>Block Blast</title>
</svelte:head>

{#if game.phase === 'landing'}
  <Landing />
{:else}
  <main class="flex min-h-dvh items-center justify-center px-4 py-4 overflow-x-hidden">
    <div class="flex flex-col w-full" style="max-width: 480px;">
      <ScoreDisplay />
      <div class="w-full aspect-square mt-1">
        <Board />
      </div>
      <PieceTray />
    </div>
  </main>

  <Notifications />
  <GameOver />
{/if}
