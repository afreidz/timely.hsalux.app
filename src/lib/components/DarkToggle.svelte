<script>
  import cl from "../helpers/classlist";
  import SunIcon from "../icons/Sun.svelte";
  import MoonIcon from "../icons/Moon.svelte";
  import { Switch } from "@rgossiaux/svelte-headlessui";

  let enabled = false;

  const classes = {
    switch: cl`
      h-9
      flex
      relative
      w-[65px]
      shrink-0
      border-2
      shadow-xl
      ease-in-out
      align-middle
      rounded-full
      duration-200
      cursor-pointer
      transition-colors
      border-transparent
      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-white
      focus-visible:ring-opacity-75
`,
    pill: cl`
      h-8
      w-8
      ring-0
      bg-white
      transform
      shadow-lg
      transition
      inline-grid
      ease-in-out
      rounded-full
      duration-200
      text-neutral-600
      pointer-events-none
      place-content-center
`,
  };
</script>

<Switch
  checked={enabled}
  on:change={() => (enabled = !enabled)}
  class={classes.switch + ` ${enabled ? "bg-yellow-500" : "bg-purple-700"}`}
>
  <span class="sr-only">
    {enabled ? "Disable" : "Enable"} Dark Mode
  </span>
  <span
    aria-hidden="true"
    class={classes.pill + ` ${enabled ? "translate-x-7" : "translate-x-0"}`}
  >
    {#if enabled}
      <SunIcon class="h-6 w-6" />
    {:else}
      <MoonIcon class="h-6 w-6" />
    {/if}
  </span>
</Switch>
