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
    overflow-auto
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
            <li class="pl-12 flex items-center">
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
                  <Icon icon="heroicons:play-circle" class="h-6 w-6" />
                </button>
              {/if}
            </li>
          {/each}
        {/await}
      </ul>
    </li>
    <li>
      <div class="flex items-center">
        <Icon
          icon="heroicons:clipboard-document-list"
          class="flex-none p-2 w-10 h-10"
        />
        <span class="flex-1 ml-2">Reports</span>
      </div>
      <ul>
        <li class="pl-12 flex items-center">
          <Icon icon="heroicons:clock" class="mr-1 w-4 h-4" />
          <a href={`#report/daily`} class="flex-1 ml-2 line-clamp-1 py-2"
            >By Day</a
          >
        </li>
      </ul>
    </li>
  </ul>
  <footer
    class={cl`
      flex
      h-full
      bg-white
      border-t
      border-white
      items-center
      justify-center

      dark:border-black
      dark:bg-neutral-900
    `}
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
