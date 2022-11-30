<script lang="ts">
  import Icon from "@iconify/svelte";
  import { isToday } from "../helpers/date";
  import { viewDate } from "../stores/timers";

  let unit: "day" | "week" = "day";
  let viewIsToday: boolean;
  let hideToday = false;
  let hideCal = false;
  let nextDate: Date;
  let prevDate: Date;
  let factor = 1;

  $: factor = unit === "day" ? 1 : 7;
  $: viewIsToday = isToday($viewDate);
  $: prevDate = new Date(+$viewDate - 1000 * 60 * 60 * 24 * factor);
  $: nextDate =
    !isToday($viewDate) && new Date(+$viewDate + 1000 * 60 * 60 * 24 * factor);

  function previous() {
    $viewDate = prevDate;
  }

  function next() {
    $viewDate = nextDate;
  }

  function setview(v: String) {
    const [yyyy, mm, dd] = v.split("-");
    $viewDate = new Date(+yyyy, +mm - 1, +dd);
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

  export { unit, hideCal, hideToday };
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
    {#if !hideToday}
      <button
        title="go to today"
        disabled={viewIsToday}
        class={buttonClass}
        on:click={() => ($viewDate = new Date())}
      >
        <Icon icon="heroicons:clock" class="w-5 h-5" />
      </button>
    {/if}
  </div>
  <div class="flex-1 flex justify-center items-center gap-4">
    <button
      disabled={!prevDate}
      class={buttonClass}
      title="go to previous day"
      on:click={() => previous()}
    >
      <Icon icon="heroicons:chevron-left" class="w-5 h-5" />
    </button>
    <slot />
    <button
      disabled={!nextDate}
      class={buttonClass}
      title="go to next day"
      on:click={() => next()}
    >
      <Icon icon="heroicons:chevron-right" class="w-5 h-5" />
    </button>
  </div>
  <div class="shrink">
    {#if !hideCal}
      <label title="jump to date" class={buttonClass}>
        <Icon icon="heroicons:calendar-days" class="w-5 h-5" />
        <input
          type="date"
          on:change={(e) => setview(e.currentTarget.value)}
          class="absolute top-0 bottom-0 left-0 right-0 opacity-0"
        />
      </label>
    {/if}
  </div>
</div>
