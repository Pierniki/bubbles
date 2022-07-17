<script lang="ts">
  import './app.css';
  import BubblesRenderer from './components/BubblesRenderer.svelte';
  import { bubbleStore } from './stores/bubbleStore';

  $: width = 0;
  $: height = 0;

  const route = 'Home';

  $: links = $bubbleStore.links
    .filter((link) => link.source.name === route)
    .map((link) => ({ source: { ...link.source, x: 0, y: 0 }, target: { ...link.target, x: 0, y: 0 } }));

  $: nodes = $bubbleStore.nodes.filter(
    (node) => links.map((link) => link.target.name).includes(node.name) || node.name === route
  );

  $: mappedLinks = links.map((link) => ({ source: link.source.index, target: link.target.index }));

  $: isReady = !isNaN(width) && !isNaN(height) && mappedLinks && nodes;
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
{#if isReady}
  <BubblesRenderer {width} {height} nodes={[...nodes]} links={[...mappedLinks]} />
{/if}
