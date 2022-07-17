<script lang="ts">
  import * as d3 from 'd3';
  import _ from 'lodash';
  import { onMount } from 'svelte';

  export let links: { source: number; target: number }[];
  export let nodes: { name: string }[];
  export let width: number;
  export let height: number;

  const r = 120;

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
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', function (d) {
        return r;
      })
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      })
      .attr('class', function (d) {
        return 'node-bubble';
      })
      .on('click', (e, i) => {
        console.log('clicked', i.name);
      });

    d3.select('.nodes')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(function (d) {
        return d.name;
      })
      .attr('x', function (d) {
        return d.x - d.name.length * 11.5;
      })
      .attr('y', function (d) {
        return d.y + 4;
      })
      .attr('dy', function (d) {
        return 5;
      })
      .attr('class', function (d) {
        return 'node-text';
      });
  };

  const tick = (links: any[], nodes: any[]) => {
    updateLinks(links);
    updateNodes(nodes);
  };

  const simulate = ({ width, height, links, nodes }: { width: number; height: number; links: any[]; nodes: any[] }) => {
    d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-1000))
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

  $: debouncedSimulate({ width, height, links, nodes });
</script>

<svg class="absolute top-0 left-0" {width} {height}><g class="links" /><g class="nodes" /></svg>
<div class="absolute node-text" />

<style>
  .links {
    stroke: #dcd3ee;
    stroke-width: 4px;
  }
</style>
