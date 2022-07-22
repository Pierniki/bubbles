<script lang="ts">
  import Router from 'svelte-spa-router';
  import './app.css';
  import BubblesRendererContainer from './components/BubblesRendererContainer.svelte';
  import NotFound from './components/NotFound.svelte';

  const routes = {
    '/:name': BubblesRendererContainer,
    '*': NotFound
  };
</script>

<div class="flex flex-col h-screen">
  <Router {routes} />
</div>
