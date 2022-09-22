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
</script>

<header
  class="p-5 flex justify-between bg-white dark:bg-neutral-900 border-b border-white dark:border-black"
>
  <div>
    <small class="text-neutral-400 ml-8">
      {$viewDate.toLocaleDateString("en", {
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
        {$viewDate.toLocaleString("en", { weekday: "long", day: "numeric" })}
      </span>
      {#if nextDay}
        <button on:click={() => next()}>
          <Icon icon="heroicons:chevron-right" class="w-8 h-8" />
        </button>
      {/if}
    </Heading>
  </div>
</header>
