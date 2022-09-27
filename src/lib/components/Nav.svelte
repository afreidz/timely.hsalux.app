<script lang="ts">
  import Icon from "@iconify/svelte";
  import cl from "../helpers/classlist";
  import { add } from "../stores/timers";
  import { isToday } from "../helpers/date";
  import viewDate from "../stores/viewDate";
  import projects, { load } from "../stores/projects";
  import { load as loadSettings } from "../stores/projects";

  const navclass = cl`
    grid
    pt-4
    flex-1
    items-center
    grid-rows-[auto_4rem]
`;

  function handleProjectClick(projectId: string) {
    const project = $projects.find((p) => p.id === projectId);
    if (project?.hasRunningTimer) {
      const timer = project.timers.find((t) => t.running);
      timer?.stop();
    } else {
      add(projectId);
    }
  }
</script>

<nav class={navclass}>
  <ul class="self-start px-4">
    <li>
      <div class="flex items-center">
        <Icon icon="heroicons:briefcase" class="flex-none p-2 w-10 h-10" />
        <span class="flex-1 ml-2">Projects</span>
        <a href="#new-project" class="flex-none" title="Add a new project">
          <Icon icon="heroicons:plus-circle" class="h-6 w-6" />
        </a>
      </div>
      <ul>
        {#await load()}
          <li class="pl-12">
            <Icon icon="eos-icons:loading" class="h-6 w-6" />
          </li>
        {:then}
          {#each $projects as project}
            <li class="pl-3 sm:pl-12 flex items-center">
              <div class={`mr-1 rounded-sm ${project.bgColor} w-4 h-4`} />
              <a
                href={`#project/${project.id}`}
                class="flex-1 ml-2 line-clamp-1 py-2">{project.name}</a
              >
              {#if isToday($viewDate)}
                <button
                  class="flex-none"
                  on:click|stopPropagation={() =>
                    handleProjectClick(project.id)}
                >
                  {#if project.hasRunningTimer}
                    <Icon icon="heroicons:stop-circle" class="h-6 w-6" />
                  {:else}
                    <Icon icon="heroicons:play-circle" class="h-6 w-6" />
                  {/if}
                </button>
              {/if}
            </li>
          {/each}
        {/await}
      </ul>
    </li>
  </ul>
  <footer
    class="h-full flex justify-center items-center border-t bg-white dark:bg-neutral-900 border-white dark:border-black"
  >
    {#await loadSettings()}
      <Icon icon="eos-icons:loading" class="w-10 h-10" />
    {:then}
      <a href="#settings">
        <Icon icon="heroicons:cog" class="w-10 h-10" />
      </a>
    {/await}
  </footer>
</nav>
