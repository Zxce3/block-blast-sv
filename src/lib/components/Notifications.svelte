<script lang="ts">
  import { game } from '$lib/stores/game.svelte'
</script>

<div
  class="fixed inset-x-0 flex flex-col items-center gap-2 pointer-events-none z-40"
  style="top: 35%;"
>
  {#each game.notifications as notif (notif.id)}
    <div
      class="animate-float-up-fade text-base font-bold tracking-widest px-5 py-1.5 rounded-full"
      style="
        font-family: 'Space Mono', monospace;
        color: {notif.color};
        text-shadow: 0 0 16px {notif.color};
        background: rgba(10, 10, 20, 0.7);
        backdrop-filter: blur(6px);
        border: 1px solid {notif.color}40;
      "
    >
      {notif.text}
    </div>
  {/each}
</div>
