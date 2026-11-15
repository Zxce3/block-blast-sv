<script lang="ts">
  let {
    filled   = false,
    colorVar = '',
    preview  = null as 'valid' | 'invalid' | null,
    clearing = false,
  } = $props()
</script>

<div
  class="cell w-full aspect-square rounded-[3px] transition-colors duration-75"
  class:filled
  class:preview-valid={preview === 'valid'}
  class:preview-invalid={preview === 'invalid'}
  class:animate-cell-clear={clearing}
  style={filled ? `background-color: ${colorVar};` : ''}
></div>

<style>
  .cell {
    background-color: var(--cell-empty);
    border: 1px solid var(--cell-border);
    box-sizing: border-box;
  }
  .cell.filled {
    border-color: transparent;
    animation: cell-place 80ms ease-out;
  }
  .cell.preview-valid {
    background-color: rgba(34, 197, 94, 0.35);
    border-color: rgba(34, 197, 94, 0.6);
  }
  .cell.preview-invalid {
    background-color: rgba(244, 63, 94, 0.35);
    border-color: rgba(244, 63, 94, 0.6);
  }
  @keyframes cell-place {
    from { transform: scale(0.6); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
</style>
