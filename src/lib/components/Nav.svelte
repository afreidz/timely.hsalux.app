<script lang="ts">
  import Icon from "@iconify/svelte";
  import cl from "../helpers/classlist";
  import { add } from "../stores/timers";
  import { projects } from "../stores/projects";

  const navclass = cl`
    grid
    flex-1
    items-center
    grid-rows-[7rem_auto_4rem]
`;

  async function handleProjectClick(projectId: string) {
    const project = $projects.find((p) => p.id === projectId);
    await project?.loadTimers();
    if (project?.hasRunningTimer) {
      const timer = project.timers.find((t) => t.running);
      timer?.stop();
    } else {
      add(projectId);
    }
  }
</script>

<nav class={navclass}>
  <h1 class="text-3xl font-thin flex justify-center text-white">
    <Icon
      icon="heroicons:bolt"
      class="p-2 w-12 h-12 rounded-full bg-blue-500"
    />
    <span class="sr-only">Time.me</span>
  </h1>
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
        {#each $projects as project}
          <li class="pl-12 flex items-center">
            <div class={`mr-1 rounded-sm ${project.bgColor} w-4 h-4`} />
            <a href={`#${project.id}`} class="flex-1 ml-2 line-clamp-1 py-2"
              >{project.name}</a
            >
            <button
              class="flex-none"
              on:click|stopPropagation={() => handleProjectClick(project.id)}
            >
              {#await project.loadTimers()}
                <Icon icon="eos-icons:loading" class="h-6 w-6" />
              {:then}
                {#if project.hasRunningTimer}
                  <Icon icon="heroicons:stop-circle" class="h-6 w-6" />
                {:else}
                  <Icon icon="heroicons:play-circle" class="h-6 w-6" />
                {/if}
              {/await}
            </button>
          </li>
        {/each}
      </ul>
    </li>
  </ul>
  <footer
    class="h-full flex justify-center items-center border-t bg-white dark:bg-neutral-900 border-white dark:border-black"
  >
    <a href="#settings">
      <Icon icon="heroicons:cog" class="w-10 h-10" />
    </a>
  </footer>
</nav>
