<script lang="ts">
  import Icon from "@iconify/svelte";
  import { add } from "../stores/timers";
  import { isToday } from "../helpers/date";
  import viewDate from "../stores/viewDate";
  import projects, { load } from "../stores/projects";
  import { load as loadSettings } from "../stores/projects";

  let showArchived = false;

  function handleProjectClick(projectId: string) {
    add(projectId, $viewDate);
  }
</script>

<nav
  class={`
    grid
    pt-4
    flex-1
    items-center
    overflow-auto
    grid-rows-[auto_4rem]
`}
>
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
          {#each $projects.filter((p) => !p.archived) as project}
            <li class="pl-12 flex items-center">
              <div class={`mr-1 rounded-sm ${project.bgColor} w-4 h-4`} />
              <a
                href={`#project/${project.id}`}
                class="flex-1 ml-2 line-clamp-1 py-2">{project.name}</a
              >
              <button
                class="flex-none"
                on:click|stopPropagation={() => handleProjectClick(project.id)}
              >
                {#if isToday($viewDate)}
                  <Icon icon="heroicons:play-circle" class="h-6 w-6" />
                {:else}
                  <Icon icon="heroicons:plus-circle" class="h-6 w-6" />
                {/if}
              </button>
            </li>
          {/each}
          {#if $projects.some((p) => p.archived)}
            <li class="my-4">
              <button
                class="pl-12 flex items-center"
                on:click={() => (showArchived = !showArchived)}
              >
                {#if showArchived}
                  <Icon icon="heroicons:eye-slash" class="mr-3 h-4 w-4" />
                {:else}
                  <Icon icon="heroicons:eye" class="mr-3 h-4 w-4" />
                {/if}
                <span>Archived</span>
              </button>
            </li>
            {#if showArchived}
              {#each $projects.filter((p) => p.archived) as project}
                <li class="pl-12 flex items-center">
                  <div class={`mr-1 rounded-sm ${project.bgColor} w-4 h-4`} />
                  <a
                    href={`#project/${project.id}`}
                    class="flex-1 ml-2 line-clamp-1 py-2">{project.name}</a
                  >
                </li>
              {/each}
            {/if}
          {/if}
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
        <li class="pl-12 flex items-center">
          <Icon icon="heroicons:calendar" class="mr-1 w-4 h-4" />
          <a href={`#report/weekly`} class="flex-1 ml-2 line-clamp-1 py-2"
            >By Week</a
          >
        </li>
      </ul>
    </li>
  </ul>
  <footer
    class={`
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
