<script lang="ts">
  import { group } from "radash";
  import Icon from "@iconify/svelte";
  import viewDate from "../../stores/viewDate";
  import Timer from "../../components/Timer.svelte";
  import Heading from "../../components/Heading.svelte";
  import timers, { type Timer } from "../../stores/timers";

  let groups;
  $: groups = group($timers, (t) => t.project.name);

  function setview(v) {
    const [yyyy, mm, dd] = v.split("-");
    $viewDate = new Date(yyyy, mm - 1, dd);
  }

  function sumTimers(timers: Timer[]) {
    return (
      timers.reduce((p, c) => p + +c.duration, 0) /
      1000 /
      60 /
      60
    ).toFixed(1);
  }
</script>

<section class="p-6">
  <Heading as="h4" variant="section" class="flex">
    <span class="flex-1 font-semibold">
      Daily Report for
      <span
        class="px-4 py-2 font-normal rounded-full inline-block bg-neutral-50 dark:bg-black/30"
      >
        {$viewDate.toLocaleDateString("en")}
      </span>
    </span>
    <label class="relative flex-none">
      <Icon icon="heroicons:calendar-days" class="w-12 h-12" />
      <input
        type="date"
        on:change={(e) => setview(e.target.value)}
        class="absolute top-0 bottom-0 left-0 right-0 opacity-0"
      />
    </label>
  </Heading>
  <div class="flex justify-center p-12">
    <ul class="flex-1 max-w-xl">
      {#each Object.entries(groups) as [projectName, timers]}
        <li class="mb-6">
          <Timer
            color={timers[0].project?.color}
            project={timers[0].project?.name}
          >
            <div class="grid grid-cols-[auto_8rem] items-center">
              <span class="ml-2 text-base">
                {projectName}
              </span>
              <small class="font-semibold text-base justify-self-end">
                {sumTimers(timers)}
                <span class="text-sm font-normal opacity-50">hr</span>
              </small>
            </div>
          </Timer>
          <div class="mx-6 p-4 bg-neutral-50 dark:bg-black/50 rounded-b-lg">
            <strong class="block font-semibold mb-2">Tasks:</strong>
            <ul>
              {#each timers as timer}
                <li class="text-neutral-600 text-sm">- {timer.task}</li>
              {/each}
            </ul>
          </div>
        </li>
      {/each}
    </ul>
  </div>
  <footer
    class="mx-12 p-6 flex border-t text-3xl border-black dark:border-white"
  >
    <strong class="flex-1 font-light">Total:</strong>
    <small class="flex-none font-semibold">
      {sumTimers($timers)}
      <span class="font-normal opacity-50">hr</span>
    </small>
  </footer>
</section>
