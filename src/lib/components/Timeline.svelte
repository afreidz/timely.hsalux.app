<script lang="ts">
  import now from "../stores/now";
  import Timer from "./Timer.svelte";
  import cl from "../helpers/classlist";
  import { onMount, tick } from "svelte";
  import subview from "../stores/subview";
  import { isToday } from "../helpers/date";
  import { timers, viewDate } from "../stores/timers";

  let viewIsToday;
  let offset: number;
  let timerNodes = [];
  let scrolled = false;
  let nowtime: HTMLElement;
  let timeline: HTMLElement;

  $: if ($timers) setview?.();
  $: if ($viewDate) scrolled = false;
  $: viewIsToday = isToday($viewDate);
  $: offset = $now.getHours() * 60 + $now.getMinutes();

  const hours = [
    "12AM",
    "1AM",
    "2AM",
    "3AM",
    "4AM",
    "5AM",
    "6AM",
    "7AM",
    "8AM",
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
    "6PM",
    "7PM",
    "8PM",
    "9PM",
    "10PM",
    "11PM",
  ];

  const classes = {
    section: cl`
      py-2
      flex
      flex-1
      flex-col
      bg-gray-100
      overflow-auto
      dark:bg-neutral-800
`,
    grid: cl`
      grid
      flex-1
      gap-y-3
      gap-x-px
      w-[4880px]
      grid-cols-[repeat(1440,0.15rem)]
`,
    hour: cl`
      border-l
      row-start-2
      row-span-full
      text-neutral-400
      border-l-neutral-200

      dark:text-neutral-700
      dark:border-l-neutral-700
`,
    now: cl`
      border-l
      relative
      row-start-1
      pt-[0.4rem]
      row-span-full
      border-red-300
      dark:border-red-500

      after:w-2
      after:h-2
      after:-top-1
      after:-left-1
      after:absolute
      after:bg-red-500
      after:rounded-full
      after:content-[" "]
`,
    nowtime: cl`
      py-1
      px-2
      bg-black/5
      text-red-500
      rounded-full
      whitespace-nowrap
      ml-[calc(100%_+_2px)]
`,
  };

  onMount(setview);

  async function setview() {
    await tick();
    const node = nowtime || timerNodes?.at(-1);
    if (!!node && !scrolled)
      node.scrollIntoView({ behavior: "smooth", inline: "center" });
  }

  function scroll(e) {
    if (!timeline) return;
    if (timeline.scrollHeight <= timeline.clientHeight) {
      e.preventDefault();
      timeline.scrollLeft -= e.deltaY;
      scrolled = true;
    }
  }
</script>

<section
  class={`timeline ${classes.section}`}
  bind:this={timeline}
  on:mousewheel={scroll}
>
  <div
    class={classes.grid}
    style={`grid-template-rows: 2.1rem 1.5rem repeat(${Math.max(
      $timers.length,
      1
    )}, 3rem) auto`}
  >
    {#each hours as hour, index}
      <div
        class={classes.hour}
        style={`grid-column-start:${Math.max(
          index * 60,
          1
        )}; grid-column-end:${Math.max(index * 60 + 1, 2)};`}
      >
        <span
          class="ml-3 inline-block bg-gray-100 dark:bg-neutral-800 relative z-10"
          >{hour}</span
        >
      </div>
    {/each}
    {#each $timers as item, index (item.id)}
      <a
        bind:this={timerNodes[index]}
        href={`#edit-timer/${item.id}`}
        style={`grid-row-start: ${index + 3}; grid-column-start: ${
          item.startCol
        }; grid-column-end: ${item.endCol};`}
        title={`${item.project.name} - ${item.task}`}
      >
        <Timer color={item.project.color} project={item.project.name}>
          <span class="ml-2">
            {item.task}
          </span>
        </Timer>
      </a>
    {/each}
    {#if viewIsToday}
      <div
        class={classes.now}
        style={`grid-column-start: ${offset}; grid-column-end: ${offset + 1};`}
      >
        <span class={classes.nowtime} bind:this={nowtime}
          >{$now.toLocaleTimeString("en-US", { timeStyle: "short" })}</span
        >
      </div>
    {/if}
  </div>
</section>

<style lang="postcss">
  .timeline::-webkit-scrollbar {
    display: none;
  }
  .timeline {
    scrollbar-width: none;
  }
</style>
