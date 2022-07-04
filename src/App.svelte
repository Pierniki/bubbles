<script lang="ts">
  import './app.css';
  import Stage from './lib/Stage.svelte';

  let canvasHeight: number | undefined = undefined;
  let canvasWidth: number | undefined = undefined;
</script>

<main class="w-full h-screen bg-slate-900 flex flex-col overflow-hidden">
  <header class="border-b-2 border-slate-600 relative z-10 shadow-md" />
  <div bind:clientHeight={canvasHeight} bind:clientWidth={canvasWidth} class="w-full">
    {#if canvasWidth !== undefined && canvasHeight !== undefined}
      <Stage width={canvasWidth} height={canvasHeight} />
    {/if}
  </div>
</main>

<style>
  header {
    min-height: 100px;
  }
  div {
    height: calc(100% - 100px);
  }
</style>
