<script lang="ts">
  import Icon from "@iconify/svelte";
  import paused from "../stores/paused";
  import subview from "../stores/subview";
  import Update from "../views/Update.svelte";
  import type { SvelteComponent } from "svelte";
  import Settings from "../views/Settings.svelte";
  import NewProject from "../views/project/New.svelte";
  import TimerDetail from "../views/timer/Detail.svelte";
  import DailyReport from "../views/report/Daily.svelte";
  import WeeklyReport from "../views/report/Weekly.svelte";
  import ProjectDetail from "../views/project/Detail.svelte";

  interface IComponentProps {
    id?: string;
  }

  let id: string;
  let overlay: HTMLElement;
  let closeBtn: HTMLElement;
  let component: typeof SvelteComponent;
  let componentProps: IComponentProps = {};

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
      case id?.startsWith("report/weekly"):
        component = WeeklyReport;
        break;
      case id?.startsWith("update"):
        component = Update;
        break;
      default:
        component = null;
        break;
    }

    $paused = !!component;
  }

  function close(e: MouseEvent) {
    if (e.target === overlay || e.currentTarget === closeBtn) {
      $subview = null;
      window.location.hash = "";
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main
  {id}
  on:click={close}
  bind:this={overlay}
  class:open={!!component}
  class={`
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
  `}
>
  <article
    class={`
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
  `}
  >
    <button
      bind:this={closeBtn}
      on:click={close}
      class={`
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
    `}
    >
      <Icon icon="mi:close" alt="close" />
    </button>
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
