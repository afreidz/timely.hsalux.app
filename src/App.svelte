<script lang="ts">
  import { onMount } from "svelte";
  import cl from "./lib/helpers/classlist";
  import Nav from "./lib/components/Nav.svelte";
  import Masthead from "./lib/components/Masthead.svelte";
  import Timeline from "./lib/components/Timeline.svelte";
  import {
    Dialog,
    Transition,
    DialogOverlay,
    TransitionChild,
  } from "@rgossiaux/svelte-headlessui";

  let subview = null;

  const classes = {
    layout: cl`
      m-12
      grid
      flex-1
      border
      rounded-md
      shadow-2xl
      border-white/60
      overflow-hidden
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
    if (window.location.hash) subview = window.location.hash;
  });

  function navigate() {
    console.log(window.location.hash);
    subview = window.location.hash;
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

<Transition show={!!subview}>
  <Dialog open>
    <TransitionChild
      leaveTo="opacity-0"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leaveFrom="opacity-100"
      leave="ease-in transition-opacity duration-300"
      enter="ease-out transition-opacity duration-300"
    >
      <DialogOverlay
        class="z-50 fixed top-0 bottom-0 left-0 right-0 bg-black/30"
      />
    </TransitionChild>
    <TransitionChild
      enterTo="translate-x-0"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
      enterFrom="translate-x-full"
      leave="delay-300 ease-in transition transition-transform duration-300"
      enter="delay-300 ease-out transition transition-transform duration-300"
    >
      <main class={classes.subview}>
        {subview}
      </main>
    </TransitionChild>
  </Dialog>
</Transition>
