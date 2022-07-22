<script lang="ts">
  import * as d3 from 'd3';
  import _ from 'lodash';
  import { onMount } from 'svelte';
  import { bubbleStore } from '../stores';

  export let links: { source: number; target: number }[];
  export let nodes: { name: string }[];
  export let width: number;
  export let height: number;

  const r = 120;
  let firstRerender = true;

  const updateLinks = (links: any[]) => {
    var u = d3
      .select('.links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('x1', function (d) {
        return d.source.x;
      })
      .attr('y1', function (d) {
        return d.source.y;
      })
      .attr('x2', function (d) {
        return d.target.x;
      })
      .attr('y2', function (d) {
        return d.target.y;
      });
  };

  const updateNodes = (nodes: any[]) => {
    const u = d3
      .select('.nodes')
      .selectAll('div')
      .attr('pointer-events', 'all')
      .data(nodes)
      .join('div')
      .html((d) => {
        const r = 100;
        const hasChildren = Boolean($bubbleStore.links.find((link) => link.source === d.name));
        return `<a class="rounded-full bg-red-600 flex justify-center items-center absolute node duration-200 text-white font-bold text-3xl ${
          hasChildren ? 'hover:scale-110' : 'cursor-default'
        }" style="height: ${r * 2}px; width: ${r * 2}px; left: ${d.x - r}px; top: ${d.y - r}px; background: ${
          d.color
        }" href="#/${d.name}">${d.name}</div>`;
      });
  };

  const tick = (links: any[], nodes: any[]) => {
    updateLinks(links);
    updateNodes(nodes);
  };

  const simulate = ({ width, height, links, nodes }: { width: number; height: number; links: any[]; nodes: any[] }) => {
    d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-2000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'link',
        d3
          .forceLink()
          .links(links)
          .distance(r * 3)
      )
      .on('tick', () => tick(links, nodes));
  };

  onMount(() => {
    simulate({ width, height, links, nodes });
  });

  const debouncedSimulate = _.debounce(simulate, 500);

  $: firstRerender ? (firstRerender = false) : debouncedSimulate({ width, height, links, nodes });
</script>

<svg class="absolute top-0 left-0" {width} {height}><g class="links" /></svg>
<div class="relative nodes" />

<style>
  .links {
    stroke: lightgray;
    stroke-width: 4px;
  }
</style>
