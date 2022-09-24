<script lang="ts">
  import { onMount } from "svelte";
  import auth from "./lib/stores/auth";
  import cl from "./lib/helpers/classlist";
  import subview from "./lib/stores/subview";
  import Nav from "./lib/components/Nav.svelte";
  import Subview from "./lib/components/Subview.svelte";
  import Titlebar from "./lib/components/Titlebar.svelte";
  import Masthead from "./lib/components/Masthead.svelte";
  import Timeline from "./lib/components/Timeline.svelte";

  console.log($auth);

  const classes = {
    layout: cl`
      grid
      flex-1
      rounded-md
      shadow-2xl
      overflow-hidden
      grid-rows-[auto_minmax(0,_1fr)]
      grid-cols-[20rem_minmax(0,_1fr)]
`,
    sidenav: cl`
      z-20
      flex
      border-r
      flex-col
      order-first
      shadow-inner
      border-white
      row-span-full
      dark:border-black
`,
    subview: cl`
      z-50
      fixed
      top-0
      w-[48%]
      right-0
      bottom-0
      bg-white
      shadow-2xl
     `,
  };

  onMount(navigate);

  function navigate() {
    $subview = window.location.hash;
  }
</script>

<svelte:window on:hashchange={navigate} />

<Titlebar />

<main class={classes.layout}>
  <Masthead />
  <Timeline />
  <aside class={classes.sidenav}>
    <Nav />
  </aside>
</main>

<Subview />
