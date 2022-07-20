<script lang="ts">
  import { Route, Router } from 'svelte-navigator';
  import './app.css';
  import BubblesRendererContainer from './components/BubblesRendererContainer.svelte';

  $: width = 0;
  $: height = 0;
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<Router primary={false}>
  <Route path="/">
    <BubblesRendererContainer {width} {height} />
  </Route>
</Router>
