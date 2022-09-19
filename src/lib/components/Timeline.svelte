<script lang="ts">
  import now from "../stores/now";
  import { onMount } from "svelte";
  import cl from "../helpers/classlist";
  import { timers } from "../stores/timers";

  let offset: number;
  let nowtime: HTMLElement;
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

  /*   const colors = [cl`bg-indigo-400`, cl`bg-emerald-400`]; */

  const classes = {
    section: cl`
      py-2
      flex
      flex-1
      flex-col
      bg-gray-100
      overflow-auto
`,
    grid: cl`
      grid
      flex-1
      gap-y-3
      gap-x-px
      w-[calc(7200px)]
      grid-cols-[repeat(1440,0.25rem)]
`,
    item: cl`
      z-20
      h-14
      px-4
      flex
      flex-wrap
      items-center
      rounded-full
      justify-start
      overflow-hidden
`,
    hour: cl`
      border-l
      row-start-2
      row-span-full
      text-neutral-400
      border-l-neutral-200
`,
    now: cl`
      border-l
      relative
      row-start-1
      pt-[0.4rem]
      row-span-full
      border-red-300

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
    chip: cl`
      h-6
      w-6
      flex
      bg-white
      rounded-full
      items-center
      justify-center
`,
  };

  onMount(setview);

  function setview() {
    if (!nowtime) return;
    nowtime.scrollIntoView({ behavior: "smooth", inline: "center" });
  }
</script>

<section class={classes.section}>
  <div
    class={classes.grid}
    style={`grid-template-rows: 2.1rem 1.5rem repeat(${Math.max(
      $timers.length,
      1
    )}, 3.5rem) auto`}
  >
    {#each hours as hour, index}
      <div
        class={classes.hour}
        style={`grid-column-start:${Math.max(
          index * 60,
          1
        )}; grid-column-end:${Math.max(index * 60 + 1, 2)};`}
      >
        <span class="ml-3 inline-block bg-gray-100 relative z-10">{hour}</span>
      </div>
    {/each}
    {#each $timers as item, index}
      <a
        href={`#edit-timer/${item.id}`}
        class={`${classes.item} ${item.project.bgColor}`}
        style={`grid-row-start: ${index + 3}; grid-column-start: ${
          item.startCol
        }; grid-column-end: ${item.endCol};`}
      >
        <figure
          title={item.project.name}
          class={`h-14 flex flex-col justify-center ${item.project.textColor}`}
        >
          <span class={classes.chip}>{item.project.name.charAt(0)}</span>
        </figure>
        <strong class="font-normal text-xs ml-2 text-white leading-[3.5rem]"
          >{item.task}</strong
        >
      </a>
    {/each}
    <div
      class={classes.now}
      style={`grid-column-start: ${offset}; grid-column-end: ${offset + 1};`}
    >
      <span class={classes.nowtime} bind:this={nowtime}
        >{$now.toLocaleTimeString("en-US", { timeStyle: "short" })}</span
      >
    </div>
  </div>
</section>
