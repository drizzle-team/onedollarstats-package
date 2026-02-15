<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { onMount } from "svelte";
  import { configure } from "onedollarstats";

  let { children } = $props();

  onMount(() => {
    configure({ hostname: "example.com", devmode: true });
  });
</script>

<svelte:head>
  <link
    rel="icon"
    href={favicon}
  />
</svelte:head>

{@render children?.()}
