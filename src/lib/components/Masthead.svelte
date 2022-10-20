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
  class={`
    p-5
    flex 
    bg-white 
    border-b
    border-white
    justify-between 
    dark:border-black
    dark:bg-neutral-900
  `}
>
  <div class="flex-1 shrink">
    <small class="text-neutral-400">
      {$viewDate?.toLocaleDateString("en", {
        month: "long",
        year: "numeric",
      })}
    </small>

    <Heading>
      <span class="flex-none">
        {$viewDate?.toLocaleString("en", { weekday: "long", day: "numeric" })}
      </span>
    </Heading>
  </div>
  <!-- <div class="mr-5 flex flex-none flex-col justify-center place-self-center">
    <label class="relative">
      <Icon icon="heroicons:calendar-days" class="w-8 h-8 sm:w-12 sm:h-12" />
      <input
        type="date"
        on:change={(e) => setview(e.target.value)}
        class="absolute top-0 bottom-0 left-0 right-0 opacity-0"
      />
    </label>
  </div> -->
</header>

<!-- <style lang="postcss">
  input[type="date"]::-webkit-calendar-picker-indicator {
    @apply absolute top-0 bottom-0 left-0 right-0 bg-transparent w-auto h-auto;
  }
</style> -->
