<script lang="ts">
  import now from "../stores/now";
  import Icon from "@iconify/svelte";
  import Heading from "./Heading.svelte";
  import { isToday } from "../helpers/date";
  import { viewDate } from "../stores/timers";

  let viewIsToday;
  let nextDay;
  let prevDay;

  $: viewIsToday = isToday($viewDate);
  $: prevDay = new Date(+$viewDate - 1000 * 60 * 60 * 24);
  $: nextDay =
    !isToday($viewDate) && new Date(+$viewDate + 1000 * 60 * 60 * 24);

  function previous() {
    $viewDate = prevDay;
  }

  function next() {
    $viewDate = nextDay;
  }

  function setview(v) {
    const [yyyy, mm, dd] = v.split("-");
    $viewDate = new Date(yyyy, mm - 1, dd);
  }

  const buttonClass = `
    p-2
    relative
    bg-white/5
    rounded-md
    inline-flex
    items-center
    leading-none
    justify-center 
    transition-colors

    
    hover:bg-white/10
    disabled:opacity-30
    disabled:hover:bg-white/5
    `;
</script>

<div
  class={`
    p-2
    flex
    bg-black/5
    items-center
    justify-center

    dark:border-b
    dark:bg-black/20
    dark:border-black
  `}
>
  <div class="shrink">
    <button
      title="go to today"
      disabled={viewIsToday}
      class={buttonClass}
      on:click={() => ($viewDate = new Date())}
    >
      <Icon icon="heroicons:clock" class="w-5 h-5" />
    </button>
  </div>
  <div class="flex-1 flex justify-center gap-4">
    <button
      disabled={!prevDay}
      class={buttonClass}
      title="go to previous day"
      on:click={() => previous()}
    >
      <Icon icon="heroicons:chevron-left" class="w-5 h-5" />
    </button>
    <button
      disabled={!nextDay}
      class={buttonClass}
      title="go to next day"
      on:click={() => next()}
    >
      <Icon icon="heroicons:chevron-right" class="w-5 h-5" />
    </button>
  </div>
  <div class="shrink">
    <label title="jump to date" class={buttonClass}>
      <Icon icon="heroicons:calendar-days" class="w-5 h-5" />
      <input
        type="date"
        on:change={(e) => setview(e.target.value)}
        class="absolute top-0 bottom-0 left-0 right-0 opacity-0"
      />
    </label>
  </div>
</div>
