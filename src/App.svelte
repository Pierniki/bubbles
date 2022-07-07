<script lang="ts">
  import tinycolor from 'tinycolor2';
  import './app.css';
  import Stage from './lib/Stage.svelte';
  import { bubbleStore } from './stores/bubbleStore';

  let canvasHeight: number | undefined = undefined;
  let canvasWidth: number | undefined = undefined;

  $: currentBubble = bubbleStore.getBubbleByName($bubbleStore.currentBubble);
  $: breadcrumbs = bubbleStore.getBubbleBreadcrumbs($bubbleStore.currentBubble).reverse();

  const getHashFromHashEvent = (e: HashChangeEvent) => {
    const hash = e.newURL.split('#')[1];
    if (hash) {
      return hash;
    }
    return null;
  };
</script>

<svelte:window
  on:hashchange={(e) => {
    const hash = getHashFromHashEvent(e);
    console.log('hashchange');
    if (hash) return bubbleStore.navigateToBubble(hash.replace('_', ' '));
    bubbleStore.navigateToBubble('Home');
  }}
/>
{#if currentBubble}
  <main
    class="w-full h-screen flex flex-col overflow-hidden"
    style:background-color={tinycolor(currentBubble.color).darken().toHexString()}
  >
    <header class=" relative z-10 shadow-md flex justify-start items-center text-white px-8 text-4xl font-bold">
      {#each breadcrumbs as bubble}
        <a
          class="text-white no-underline"
          disabled={bubble === $bubbleStore.currentBubble}
          href={`#${bubble}`}
          on:click={() => bubbleStore.navigateToBubble(bubble)}
        >
          {bubble}
        </a>
        {#if bubble !== $bubbleStore.currentBubble}<span class="text-white">&gt;</span>{/if}
      {/each}
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
