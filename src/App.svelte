<script lang="ts">
  import { onMount } from "svelte";
  import nav from "./lib/stores/nav";
  import auth from "./lib/stores/auth";
  import cl from "./lib/helpers/classlist";
  import subview from "./lib/stores/subview";
  import Auth from "./lib/views/Auth.svelte";
  import viewDate from "./lib/stores/viewDate";
  import Nav from "./lib/components/Nav.svelte";
  import Logo from "./lib/components/Logo.svelte";
  import Subview from "./lib/components/Subview.svelte";
  import Masthead from "./lib/components/Masthead.svelte";
  import Timeline from "./lib/components/Timeline.svelte";
  import Titlebar from "./lib/components/Titlebar.svelte";

  let classes;
  $: if (!!$auth && !$viewDate) $viewDate = new Date();

  $: classes = {
    layout: cl`
      grid
      flex-1
      rounded-md
      shadow-2xl
      overflow-hidden
      grid-rows-[7.75rem_auto]
      grid-cols-[6rem_auto]
      sm:grid-cols-[20rem_auto]
      
      `,
    sidenav: cl`
      z-20
      flex
      fixed
      left-0
      border-r
      flex-col
      bottom-0
      bg-white
      w-[20rem]
      ease-in-out
      shadow-inner
      border-white
      duration-300
      top-[7.75rem]
      transition-transform
      
      ${$nav ? "translate-x-0" : "-translate-x-full"}
      
      dark:border-black
      dark:bg-neutral-900
      
      sm:static
      sm:right-auto
      sm:translate-x-0
      sm:bg-transparent
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

{#if !$auth}
  <Auth />
{:else}
  <Titlebar />
  <main class={classes.layout}>
    <Logo class="order-first" />
    <Masthead />
    <aside class={classes.sidenav}>
      <Nav />
    </aside>
    <Timeline class="col-span-full sm:col-span-1" />
  </main>
  <Subview />
{/if}
