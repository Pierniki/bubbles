<script lang="ts">
  import tinycolor from 'tinycolor2';
  import { bubbleStore } from './stores/bubbleStore';
  import './app.css';
  import Stage from './lib/Stage.svelte';

  let canvasHeight: number | undefined = undefined;
  let canvasWidth: number | undefined = undefined;

  $: currentBubble = bubbleStore.getBubbleByName($bubbleStore.currentBubble);
</script>

{#if currentBubble}
  <main
    class="w-full h-screen flex flex-col overflow-hidden"
    style:background-color={tinycolor(currentBubble.color).darken().toHexString()}
  >
    <header class=" relative z-10 shadow-md flex justify-start items-center text-white px-8 text-4xl font-bold">
      {currentBubble.name}
    </header>
    <div
      bind:clientHeight={canvasHeight}
      bind:clientWidth={canvasWidth}
      class="w-full"
      style:background-color={currentBubble.color}
    >
      {#if canvasWidth !== undefined && canvasHeight !== undefined}
        {#key currentBubble.name}
          <Stage width={canvasWidth} height={canvasHeight} {currentBubble} />
        {/key}
      {/if}
    </div>
  </main>
{/if}

<style>
  header {
    min-height: 100px;
  }
  div {
    height: calc(100% - 100px);
  }
</style>
