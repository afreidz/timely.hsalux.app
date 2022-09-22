<script lang="ts">
  import Icon from "@iconify/svelte";
  import cl from "../helpers/classlist";
  import subview from "../stores/subview";
  import type { SvelteComponent } from "svelte";
  import Settings from "../subviews/Settings.svelte";
  import NewProject from "../subviews/project/New.svelte";
  import TimerDetail from "../subviews/timer/Detail.svelte";

  interface IComponentProps {
    id?: string;
  }

  let id: string;
  let overlay: HTMLElement;
  let component: typeof SvelteComponent;
  let componentProps: IComponentProps = {};

  const classes = {
    close: cl`
      top-0
      right-0
      absolute
      w-10 h-10
      rounded-sm
      inline-flex
      items-center
      justify-center 
      hover:bg-red-500 
      transition-colors
    `,
    overlay: cl`
      z-50
      fixed
      top-0
      group
      left-0
      right-0
      bottom-0
      opacity-0
      invisible 
      ease-in-out
      duration-300
      transition-opacity
      backdrop-blur-sm

      target:visible
      target:opacity-100
  `,
    window: cl`
      z-50   
      flex
      px-10
      fixed
      top-0
      w-[50%]
      right-0
      flex-col
      bottom-0
      border-l
      ease-in-out
      duration-300
      min-w-[600px]
      translate-x-full
      border-neutral-200
      transition-transform
      bg-white max-w-[1200px]
      group-target:translate-x-0

      dark:border-black
      dark:bg-neutral-800
`,
  };

  $: {
    id = $subview?.replace("#", "");

    switch (true) {
      case id?.startsWith("new-project"):
        component = NewProject;
        break;
      case id?.startsWith("edit-timer"):
        componentProps.id = id?.split("/")[1];
        component = TimerDetail;
        break;
      case id?.startsWith("settings"):
        component = Settings;
        break;
      default:
        component = null;
        break;
    }
  }

  function close(e: MouseEvent) {
    if (e.target !== overlay) return;
    $subview = null;
    window.location.hash = "";
  }
</script>

<main
  {id}
  on:click={close}
  bind:this={overlay}
  class={classes.overlay}
  class:open={!!component}
>
  <article class={classes.window}>
    <a href="#" class={classes.close}>
      <Icon icon="mi:close" alt="close" />
    </a>
    <svelte:component this={component} {...componentProps} />
  </article>
</main>

<style lang="postcss">
  .open {
    @apply opacity-100 visible;
  }
  .open article {
    @apply translate-x-0;
  }
</style>
