<script lang="ts">
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';

  interface Node {
    x: number;
    y: number;
    r: number;
  }

  export let width: number;
  export let height: number;
  let canvas: HTMLCanvasElement | undefined = undefined;

  const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

  let mousePosition = {
    x: 0,
    y: 0
  };

  const colors = ['#49cc6c', '#ccab49', '#cc4949', '#49bbcc', '#7d49cc'];
  let nodes = colors.map((color) => ({
    x: randomBetween(width / 3, (width / 3) * 2),
    y: randomBetween(height / 3, (height / 3) * 2),
    r: randomBetween(50, 200),
    weight: randomBetween(3, 5) * 0.2,
    color: color,
    movement: { x: 0, y: 0 }
  }));

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
    const cx = canvas.getContext('2d');
    window.requestAnimationFrame(() => drawCircles(canvas, cx));
  });

  const minmax = ({ min, max, val }: { min?: number; max?: number; val?: number }) => {
    if (min !== undefined && val < min) return min;
    if (max !== undefined && val > max) return max;
    return val;
  };

  const drawCircles = (canvas: HTMLCanvasElement, cx: CanvasRenderingContext2D) => {
    cx.clearRect(0, 0, canvas.width, canvas.height);

    let isHovering = nodes.map(() => false);
    nodes.forEach((node, idx) => {
      //   if (idx === 1) {
      //     node.x = mousePosition.x;
      //     node.y = mousePosition.y;
      //   }
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
      isHovering[idx] = cx.isPointInPath(mousePosition.x, mousePosition.y);

      cx.closePath();
    });

    springedMovement.set(nodes.map((node) => node.movement));
    springedRs.set(
      nodes.map((node, idx) => {
        const base = Math.sqrt(width) * node.weight * 6;
        return isHovering[idx] ? base + 50 : base;
      })
    );

    window.requestAnimationFrame(() => drawCircles(canvas, cx));
  };

  const movement = (a: Node, b: Node) => {
    const dist = distance(a, b);
    if (dist < a.r + b.r) return { x: (b.x - a.x) / -50, y: (b.y - a.y) / -50 };
    return { x: 0, y: 0 };
  };

  const distance = (a: Node, b: Node) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
</script>

<canvas
  bind:this={canvas}
  {height}
  {width}
  class="  bg-slate-800"
  on:mousemove={(e) => (mousePosition = { x: e.clientX, y: e.clientY - 100 })}
/>
