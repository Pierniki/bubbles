<script lang="ts">
  import * as d3 from 'd3';
  import _ from 'lodash';
  import { onMount } from 'svelte';
  import './app.css';
  import { bubbleStore } from './stores/bubbleStore';

  $: width = 0;
  $: height = 0;

  const route = 'Home';

  //   $: links = $bubbleStore.links
  //     .filter((link) => link.source.name === route)
  //     .map((link) => ({ source: { ...link.source, x: 0, y: 0 }, target: { ...link.target, x: 0, y: 0 } }));

  //   $: nodes = $bubbleStore.nodes
  //     .filter((node) => links.map((link) => link.target.name).includes(node.name) || node.name === route)
  //     .map((bubble) => ({ ...bubble, x: 0, y: 0, radius: 40 }));

  const r = 80;

  let nodes = [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }];

  let links = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 0, target: 3 }
  ];

  const updateLinks = (links: any[]) => {
    console.log('updateLinks', links);
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
      .style('fill', function (d) {
        return '#B19CD9';
      });

    d3.select('.nodes')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(function (d) {
        return d.name;
      })
      .attr('x', function (d) {
        return d.x - 12;
      })
      .attr('y', function (d) {
        return d.y + 4;
      })
      .attr('dy', function (d) {
        return 5;
      })
      .style('fill', function (d) {
        return '#ffffff';
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

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<svg class="absolute top-0 left-0" {width} {height}><g class="links" /><g class="nodes" /></svg>

<style>
  .links {
    stroke: #dcd3ee;
    stroke-width: 4px;
  }
  .nodes {
    font-size: 40px;
    font-weight: bold;
  }
</style>
