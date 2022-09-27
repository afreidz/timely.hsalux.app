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
</script>

<header
  class={`p-5 pr-16 flex justify-between bg-white dark:bg-neutral-900 border-b border-white dark:border-black ${$$props.class}`}
>
  <div>
    <small class="text-neutral-400 ml-8">
      {$viewDate?.toLocaleDateString("en", {
        month: "long",
        year: "numeric",
      })}
    </small>

    <Heading>
      {#if prevDay}
        <button on:click={() => previous()}>
          <Icon icon="heroicons:chevron-left" class="w-8 h-8" />
        </button>
      {/if}
      <span class="flex-none w-72">
        {$viewDate?.toLocaleString("en", { weekday: "long", day: "numeric" })}
      </span>
      {#if nextDay}
        <button on:click={() => next()}>
          <Icon icon="heroicons:chevron-right" class="w-8 h-8" />
        </button>
      {/if}
    </Heading>
  </div>
  <div class="flex flex-col justify-center">
    <label class="relative">
      <Icon icon="heroicons:calendar-days" class="w-12 h-12" />
      <input
        type="date"
        on:change={(e) => setview(e.target.value)}
        class="absolute top-0 bottom-0 left-0 right-0 opacity-0"
      />
    </label>
  </div>
</header>

<style lang="postcss">
  input[type="date"]::-webkit-calendar-picker-indicator {
    @apply absolute top-0 bottom-0 left-0 right-0 bg-transparent w-auto h-auto;
  }
</style>
