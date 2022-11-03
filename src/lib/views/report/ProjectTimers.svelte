<script lang="ts">
  import { group } from "radash";
  import Timer from "../../components/Timer.svelte";
  import type { Timer as TTimer } from "../../stores/timers";

  let timers: TTimer[];
  let groups: Record<string, TTimer[]>;

  $: groups = group(timers, (t: TTimer) => t.project.name);

  function sumTimers(timers: TTimer[]) {
    return timers.reduce((p, c) => +p + +c.hours, 0);
  }

  export { timers };
</script>

<ul class="flex-1 max-w-xl">
  {#each Object.entries(groups) as [projectName, timers]}
    <li class="mb-6">
      <Timer color={timers[0].project?.color} project={timers[0].project?.name}>
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
