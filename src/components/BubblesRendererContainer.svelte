<script lang="ts">
  import { BubbleStore, bubbleStore, Link, Node } from '../stores';
  import BubblesRenderer from './BubblesRenderer.svelte';

  export let params: { name: string };

  $: width = 0;
  $: height = 0;

  $: route = params.name ?? 'home';

  $: routeNodes = getNodesByRoute($bubbleStore.nodes, $bubbleStore.links, route);

  $: routeLinks = getLinksByRoute($bubbleStore.links, routeNodes, route);

  const getLinksByRoute = (links: Link[], routeNodes: Node[], route: string) =>
    links
      .filter((link) => {
        if (link.source === route) return true;
        return false;
      })
      .map((link) => {
        return {
          source: routeNodes.findIndex((node) => node.name === link.source),
          target: routeNodes.findIndex((node) => node.name === link.target)
        };
      });

  const getNodesByRoute = (nodes: Node[], links: Link[], route: string) =>
    nodes.filter((node) => {
      if (node.name === route) return true;
      if (links.find((link) => link.source === route && link.target === node.name)) return true;
      return false;
    });

  $: isReady = !isNaN(width) && !isNaN(height) && routeNodes.length > 0 && routeLinks.length > 0;

  const getNodeParents = (nodeName: string, store: BubbleStore, parents: Node[] = []): Node[] => {
    const { links, nodes } = store;

    const parentLink = links.find((link) => link.target === nodeName);
    const parentNode = nodes.find((node) => node.name === parentLink?.source);
    if (parentNode) {
      parents.push(parentNode);
      return getNodeParents(parentNode.name, store, parents);
    }
    return parents;
  };

  $: nodeParents = getNodeParents(route, $bubbleStore);
</script>

<nav
  class="h-[100px] border-b-4 border-slate-700 flex items-center justify-start p-8 gap-4 font-bold text-slate-700 text-2xl"
>
  {#each nodeParents as parent}
    <a href={`${import.meta.env.PROD ? '/bubbles' : ''}/#/${parent.name}`}>{parent.name} > </a>
  {/each}
  <span class="text-slate-300">{route}</span>
</nav>
<div bind:clientWidth={width} bind:clientHeight={height} class="h-full w-full">
  {#if isReady}
    {#key [routeNodes, routeLinks]}
      <BubblesRenderer {width} {height} nodes={[...routeNodes]} links={[...routeLinks]} />
    {/key}
  {/if}
</div>
