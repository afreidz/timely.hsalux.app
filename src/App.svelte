<script lang="ts">
  import "./lib/helpers/forceload";
  import { onMount } from "svelte";
  import nav from "./lib/stores/nav";
  import auth from "./lib/stores/auth";
  import error from "./lib/stores/error";
  import theme from "./lib/stores/theme";
  import subview from "./lib/stores/subview";
  import Auth from "./lib/views/Auth.svelte";
  import viewDate from "./lib/stores/viewDate";
  import Nav from "./lib/components/Nav.svelte";
  import Logo from "./lib/components/Logo.svelte";
  import Error from "./lib/components/Error.svelte";
  import Subview from "./lib/components/Subview.svelte";
  import Masthead from "./lib/components/Masthead.svelte";
  import Timeline from "./lib/components/Timeline.svelte";
  import { useRegisterSW } from "virtual:pwa-register/svelte";

  let title: string;

  const { needRefresh } = useRegisterSW();

  $: if ($needRefresh) $subview = "update";
  $: if (!!$auth && !$viewDate) $viewDate = new Date();
  $: title = !$subview ? $viewDate?.toLocaleDateString("en") || "" : null;

  onMount(navigate);

  function navigate() {
    $subview = window.location.hash;
  }
</script>

<svelte:head>
  {#if title}
    <title>{title}</title>
  {/if}
</svelte:head>

<svelte:window on:hashchange={navigate} />

<div
  class="flex flex-col flex-1"
  class:dark={$theme === "dark"}
  class:text-white={$theme === "dark"}
  class:text-black={$theme !== "dark"}
>
  {#if !$auth}
    <Auth />
  {:else}
    <main
      class={`
        grid
        flex-1
        border-t
        shadow-2xl
        overflow-hidden
        dark:border-black
        grid-cols-[6rem_auto]
        grid-rows-[7.75rem_auto]
        sm:grid-cols-[20rem_auto]
    `}
    >
      <Logo />
      <Masthead />
      <aside
        class={`
          z-20
          flex
          fixed
          left-0
          w-full
          bg-white
          border-r
          flex-col
          bottom-0
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
          sm:w-[20rem]
          sm:right-auto
          sm:translate-x-0
      `}
      >
        <Nav />
      </aside>
      <Timeline class="col-span-full sm:col-span-1" />
    </main>
    <Subview />
  {/if}
  {#if $error}
    <Error message={$error.message} />
  {/if}
</div>
