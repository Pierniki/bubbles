<script lang="ts">
  import { useLocation } from 'svelte-navigator';
  import { bubbleStore, Link, Node } from '../stores';
  import BubblesRenderer from './BubblesRenderer.svelte';

  export let width = 0;
  export let height = 0;

  const location = useLocation();

  $: route = $location.hash.split('#')[1] ?? 'home';

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

  // $: console.log($bubbleStore.links, $bubbleStore.nodes, route);
  // $: console.log(route, routeNodes, routeLinks, isReady);

  $: console.log(route);
</script>

{#if isReady}
  {#key [routeNodes, routeLinks]}
    <BubblesRenderer {width} {height} nodes={[...routeNodes]} links={[...routeLinks]} />
  {/key}
{/if}
