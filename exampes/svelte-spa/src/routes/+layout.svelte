<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { onMount } from "svelte";
  import { configure } from "onedollarstats";

  let { children } = $props();

  configure({ trackLocalhostAs: "example.com" });
</script>

<svelte:head>
  <link
    rel="icon"
    href={favicon}
  />
</svelte:head>

{@render children?.()}
