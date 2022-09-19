<script lang="ts">
  import cl from "../helpers/classlist";
  import subview from "../stores/subview";
  import type { SvelteComponent } from "svelte";
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
      bg-black/20
      ease-in-out
      duration-300
      transition-opacity

      target:visible
      target:opacity-100
  `,
    window: cl`
      z-50   
      flex
      fixed
      top-0
      w-[40%]
      right-0
      flex-col
      bottom-0
      bg-white/70
      ease-in-out
      duration-300
      min-w-[600px]
      backdrop-blur-xl
      translate-x-full
      transition-transform
      group-target:translate-x-0
`,
  };

  $: {
    id = $subview?.replace("#", "");

    switch (true) {
      case id?.startsWith("new-project"):
        component = NewProject;
        break;
      case id?.startsWith("edit-timer"):
        console.log(id?.split("/")[1]);
        componentProps.id = id?.split("/")[1];
        component = TimerDetail;
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
