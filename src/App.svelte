<script lang="ts">
  import { onMount } from "svelte";
  import cl from "./lib/helpers/classlist";
  import subview from "./lib/stores/subview";
  import Nav from "./lib/components/Nav.svelte";
  import Subview from "./lib/components/Subview.svelte";
  import Masthead from "./lib/components/Masthead.svelte";
  import Timeline from "./lib/components/Timeline.svelte";

  const classes = {
    layout: cl`
      m-12
      grid
      flex-1
      border
      rounded-md
      shadow-2xl
      overflow-hidden
      border-white/60
      grid-rows-[auto_minmax(0,_1fr)]
      grid-cols-[16rem_minmax(0,_1fr)]
`,
    sidenav: cl`
      z-20
      flex
      flex-col
      order-first
      bg-white/40
      shadow-inner
      row-span-full
      backdrop-blur-xl
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

  onMount(() => {
    if (window.location.hash) navigate();
  });

  function navigate() {
    $subview = window.location.hash;
  }
</script>

<svelte:window on:hashchange={navigate} />

<main class={classes.layout}>
  <Masthead />
  <Timeline />
  <aside class={classes.sidenav}>
    <Nav />
  </aside>
</main>

<Subview />
