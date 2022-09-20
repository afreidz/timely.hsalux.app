<script lang="ts">
  import Icon from "@iconify/svelte";
  import cl from "../helpers/classlist";
  import { add } from "../stores/timers";
  import { projects } from "../stores/projects";

  const navclass = cl`
    px-4
    grid
    flex-1
    items-center
    grid-rows-[7rem_auto_5rem]
`;

  function handleProjectClick(projectId: string) {
    const project = $projects.find((p) => p.id === projectId);
    if (project.hasRunningTimer) {
      project.timers.filter((t) => t.running).forEach((t) => t.stop());
    } else {
      add(projectId);
    }
  }
</script>

<nav class={navclass}>
  <h1 class="text-3xl font-thin flex justify-center text-white">
    <Icon
      icon="bi:lightning-charge"
      class="p-2 w-12 h-12 rounded-full bg-blue-500"
    />
    <span class="sr-only">Time.me</span>
  </h1>
  <ul class="self-start">
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
          <li class="py-2 pl-10 flex items-center">
            <span class="flex-1 ml-2">{project.name}</span>
            <button
              class="flex-none"
              on:click={() => handleProjectClick(project.id)}
            >
              {#if project.hasRunningTimer}
                <Icon icon="heroicons:stop-circle" class="h-6 w-6" />
              {:else}
                <Icon icon="heroicons:play-circle" class="h-6 w-6" />
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    </li>
  </ul>
  <footer class="flex justify-center" />
</nav>
