<script lang="ts">
  import { bubbleStore, RegisteredBubble } from '../stores/bubbleStore';

  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { minmax } from './utility';

  export let currentBubble: RegisteredBubble;

  interface Circle {
    x: number;
    y: number;
    r: number;
  }

  export let width: number;
  export let height: number;
  let canvas: HTMLCanvasElement | undefined = undefined;

  let mousePosition = {
    x: 0,
    y: 0
  };

  let hoveringOn: string | null = null;

  $: images = currentBubble.children.map((child) => {
    const bubble = bubbleStore.getBubbleByName(child);
    if (!bubble || !bubble.bgImage) return null;
    const img = new Image();
    img.src = bubble.bgImage;
    return img;
  });

  let nodes = currentBubble.children
    .map((child) => {
      const bubble = bubbleStore.getBubbleByName(child);
      if (!bubble) return null;

      return {
        name: bubble.name,
        x: bubble.position.w * width,
        y: bubble.position.h * height,
        color: bubble.color,
        weight: bubble.weight,
        bgImage: bubble.bgImage,
        movement: { x: 0, y: 0 }
      };
    })
    .filter((node): node is NonNullable<typeof node> => node !== null);

  const springedMovement = spring(
    nodes.map((node) => node.movement),
    {
      stiffness: 0.02,
      damping: 0.5
    }
  );
  const springedRs = spring(
    nodes.map(() => 0),
    {
      stiffness: 0.04,
      damping: 0.5
    }
  );

  onMount(() => {
    if (!canvas) return;
    const cx = canvas.getContext('2d');
    if (!cx) return;
    window.requestAnimationFrame(() => drawCircles(canvas!, cx));
  });

  const drawCircles = (canvas: HTMLCanvasElement, cx: CanvasRenderingContext2D) => {
    cx.clearRect(0, 0, canvas.width, canvas.height);

    let hoveringOnList = nodes.map(() => false);
    nodes.forEach((node, idx) => {
      const r = $springedRs[idx];
      const movements = nodes
        .map((node, idx) => ({ ...node, r: $springedRs[idx] }))
        .filter((n, filterIdx) => filterIdx !== idx)
        .map((other) => movement({ ...node, r: r }, other));

      const movementVector = movements.reduce(
        (sum, vector) => {
          return { x: sum.x + vector.x, y: sum.y + vector.y };
        },
        { x: 0, y: 0 }
      );

      node.movement = movementVector;

      node.x = minmax({ min: r, max: canvas.width - r, val: node.x + $springedMovement[idx].x });
      node.y = minmax({ min: r, max: canvas.height - r, val: node.y + $springedMovement[idx].y });

      if (node.movement.x > 0) node.movement.x -= 0.1;
      if (node.movement.y > 0) node.movement.y -= 0.1;

      cx.beginPath();
      cx.arc(node.x, node.y, r > 0 ? r : 0, 0, 2 * Math.PI, false);
      cx.fillStyle = node.color;
      cx.fill();
      hoveringOnList[idx] = cx.isPointInPath(mousePosition.x, mousePosition.y);
      cx.closePath();

      const img = images[idx];
      if (node.bgImage && img) {
        const aspectRatio = img.width / img.height;
        const horizontal = img.width >= img.height;
        const imgW = horizontal ? r * 2 * aspectRatio : r * 2;
        const imgH = horizontal ? r * 2 : (r * 2) / aspectRatio;
        cx.save();
        cx.beginPath();
        cx.arc(node.x, node.y, r > 0 ? r : 0, 0, Math.PI * 2, true);

        cx.closePath();
        cx.clip();

        cx.drawImage(img, node.x - imgW / 2, node.y - imgH / 2, imgW, imgH);

        cx.restore();
      }

      const fontSize = (2 * r) / node.name.length;
      cx.font = `bold ${fontSize}px Courier `;
      cx.textAlign = 'center';

      cx.fillStyle = 'black';
      cx.fillText(node.name, node.x + fontSize / 10, node.y + fontSize / 5);
      cx.fillStyle = 'white';
      cx.fillText(node.name, node.x, node.y + fontSize / 5);

      cx.closePath();
    });

    const hoveringOnIdx = nodes.reduce((closest, node, idx) => {
      if (!hoveringOnList[idx]) return closest;
      if (closest === -1) return idx;
      if (distance(node, mousePosition) < distance(nodes[closest], mousePosition)) return idx;
      return closest;
    }, -1);
    hoveringOn = hoveringOnIdx >= 0 ? nodes[hoveringOnIdx].name : null;

    springedMovement.set(nodes.map((node) => node.movement));
    springedRs.set(
      nodes.map((node, idx) => {
        const base = ((Math.sqrt(width) + Math.sqrt(height)) / 2) * node.weight * 6;
        return idx === hoveringOnIdx ? base * 1.1 : base;
      })
    );

    window.requestAnimationFrame(() => drawCircles(canvas, cx));
  };

  const movement = (a: Circle, b: Circle) => {
    const dist = distance(a, b);
    if (dist < a.r / b.r) return { x: (10 + (b.x - a.x)) / -25, y: (10 + (b.y - a.y)) / 25 };
    if (dist < a.r + b.r) return { x: (5 + (b.x - a.x)) / -50, y: (5 + (b.y - a.y)) / -50 };
    return { x: 0, y: 0 };
  };

  const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
</script>

<canvas
  bind:this={canvas}
  {height}
  {width}
  style:cursor={hoveringOn ? 'pointer' : 'default'}
  on:click={() => {
    if (!hoveringOn) return;
    bubbleStore.navigateToBubble(hoveringOn);
  }}
  on:mousemove={(e) => (mousePosition = { x: e.clientX, y: e.clientY - 100 })}
/>
