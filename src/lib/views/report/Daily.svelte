<script lang="ts">
  import { group } from "radash";
  import viewDate from "../../stores/viewDate";
  import Timer from "../../components/Timer.svelte";
  import Heading from "../../components/Heading.svelte";
  import Actions from "../../components/Actions.svelte";
  import timers, { type Timer as TTimer } from "../../stores/timers";

  let groups: Record<string, TTimer[]>;
  $: groups = group($timers, (t) => t.project.name);

  function setview(v) {
    const [yyyy, mm, dd] = v.split("-");
    $viewDate = new Date(yyyy, mm - 1, dd);
  }

  function sumTimers(timers: TTimer[]) {
    return (
      timers.reduce((p, c) => p + +c.duration, 0) /
      1000 /
      60 /
      60
    ).toFixed(1);
  }
</script>

<svelte:head>
  <title>Daily report for: {$viewDate.toLocaleDateString("en")}</title>
</svelte:head>

<header class="view-heading">
  <Heading as="h4">
    Daily Report for
    {$viewDate.toLocaleDateString("en")}
  </Heading>
</header>
<Actions />
<section class="p-6">
  <div class="flex justify-center my-6">
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
              {#each [...new Set(timers.map((t) => t.task))] as task}
                <li class="text-neutral-600 text-sm">- {task}</li>
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
