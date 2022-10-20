<script lang="ts">
  import now from "../stores/now";
  import Icon from "@iconify/svelte";
  import Timer from "./Timer.svelte";
  import cl from "../helpers/classlist";
  import Actions from "./Actions.svelte";
  import { onMount, tick } from "svelte";
  import subview from "../stores/subview";
  import viewDate from "../stores/viewDate";
  import { isToday } from "../helpers/date";
  import timers, { load } from "../stores/timers";

  let viewIsToday;
  let offset: number;
  let timerNodes = [];
  let scrolled = false;
  let nowtime: HTMLElement;
  let timeline: HTMLElement;

  $: if ($viewDate) scrolled = false;
  $: viewIsToday = isToday($viewDate);
  $: if ($timers && !scrolled) setview?.();
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

  onMount(setview);

  async function setview() {
    await tick();
    const node = nowtime || timerNodes?.at(0);
    const inline = nowtime ? "center" : "start";
    if (!!node && !scrolled)
      node.scrollIntoView({ behavior: "smooth", inline });
  }
</script>

<section
  bind:this={timeline}
  on:scroll={() => (scrolled = true)}
  class={`
    timeline
    flex
    flex-1
    flex-col
    bg-gray-100
    overflow-auto
    dark:bg-neutral-800
    ${$$props.class}
  `}
>
  {#await load()}
    <div class="self-center justify-self-center">
      <Icon icon="eos-icons:loading" class="w-12 h-12" />
    </div>
  {:then}
    <header class="sticky left-0 top-0 mb-2">
      <Actions />
    </header>
    <div
      class={`
        grid
        flex-1
        gap-y-3
        gap-x-px
        w-[4880px]
        grid-cols-[repeat(1440,0.15rem)]
        grid-rows-[2.1rem_1.5rem_repeat(${$timers?.length || 1},2.5rem)_auto]

        ${!viewIsToday ? "-mt-[3.2rem]" : ""}
    `}
    >
      {#each hours as hour, index}
        <div
          class={`
            border-l
            invisible
            sm:visible
            row-start-2
            row-span-full
            text-neutral-400
            border-l-neutral-200
            dark:text-neutral-700
            dark:border-l-neutral-700
            col-start-[${index * 60 || 1}] 
          `}
        >
          <span
            class={`
              z-10
              ml-3
              relative
              bg-gray-100
              inline-block
              dark:bg-neutral-800
            `}>{hour}</span
          >
        </div>
      {/each}
      {#each $timers as item, index (item.id)}
        <a
          href={`#timer/${item.id}`}
          bind:this={timerNodes[index]}
          class={`
            row-start-[${index + 3}]
            col-end-[${item.endCol}]
            col-start-[${item.startCol}]
          `}
          title={`${item.project?.name} - ${item.task}`}
        >
          <Timer color={item.project?.color} project={item.project?.name}>
            <span class="ml-2">
              {item.task}
            </span>
          </Timer>
        </a>
      {/each}
      {#if viewIsToday}
        <div
          class={`
            border-l
            relative
            invisible
            sm:visible
            row-start-1
            pt-[0.4rem]
            row-span-full
            border-red-300
            dark:border-red-500 

            col-start-[${offset}]
            col-end-[${offset + 1}]
          `}
        >
          <span
            class={`
              py-1
              px-2
              text-red-500
              rounded-full
              bg-red-500/20
              whitespace-nowrap
              ml-[calc(100%_+_2px)]
            `}
            bind:this={nowtime}
            >{$now.toLocaleTimeString("en-US", { timeStyle: "short" })}</span
          >
        </div>
      {/if}
    </div>
  {/await}
</section>

<style lang="postcss">
  .timeline::-webkit-scrollbar {
    display: none;
  }
  .timeline {
    scrollbar-width: none;
  }
</style>
