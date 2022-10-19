<script lang="ts">
  import Icon from "@iconify/svelte";
  import paused from "../stores/paused";
  import cl from "../helpers/classlist";
  import subview from "../stores/subview";
  import type { SvelteComponent } from "svelte";
  import Settings from "../views/Settings.svelte";
  import NewProject from "../views/project/New.svelte";
  import TimerDetail from "../views/timer/Detail.svelte";
  import DailyReport from "../views/report/Daily.svelte";
  import ProjectDetail from "../views/project/Detail.svelte";

  interface IComponentProps {
    id?: string;
  }

  let id: string;
  let overlay: HTMLElement;
  let component: typeof SvelteComponent;
  let componentProps: IComponentProps = {};

  const classes = {
    close: cl`
      m-1
      top-0
      right-0
      w-8 h-8
      absolute
      rounded-sm
      bg-white/5
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
      bg-white/5 
      ease-in-out
      duration-300
      dark:bg-black/10
      transition-opacity
      backdrop-blur-[1px]

      target:visible
      target:opacity-100
  `,
    window: cl`
      z-50   
      flex
      fixed
      top-0
      w-full
      right-0
      flex-col
      bottom-0
      border-l
      bg-white
      ease-in-out
      duration-300
      overflow-auto
      drop-shadow-2xl
      translate-x-full
      border-neutral-200
      transition-transform
      group-target:translate-x-0
      
      sm:w-[50%]
      sm:min-w-[600px]
      sm:max-w-[1200px]

      dark:border-black
      dark:bg-neutral-800
`,
  };

  $: {
    id = $subview?.replace("#", "");
    componentProps = {};

    switch (true) {
      case id?.startsWith("new-project"):
        component = NewProject;
        break;
      case id?.startsWith("timer/"):
        componentProps.id = id.split("timer/")[1];
        component = TimerDetail;
        break;
      case id?.startsWith("settings"):
        component = Settings;
        break;
      case id?.startsWith("project/"):
        componentProps.id = id.split("project/")[1];
        component = ProjectDetail;
        break;
      case id?.startsWith("report/daily"):
        component = DailyReport;
        break;
      default:
        component = null;
        break;
    }

    $paused = !!component;
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
