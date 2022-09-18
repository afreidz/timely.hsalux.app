<script>
  import Add from "../icons/Add.svelte";
  import cl from "../helpers/classlist";
  import { add } from "../stores/timers";
  import Logo from "../icons/Logo.svelte";
  import DarkToggle from "./DarkToggle.svelte";
  import { projects } from "../stores/projects";
  import Project from "../icons/Project.svelte";

  const navclass = cl`
    px-4
    grid
    flex-1
    text-white
    items-center
    grid-rows-[7rem_auto_5rem]
`;
</script>

<nav class={navclass}>
  <h1 class="text-3xl font-thin flex justify-center">
    <Logo class="p-2 w-12 h-12 rounded-full bg-blue-500" />
    <span class="sr-only">Time.me</span>
  </h1>
  <ul class="self-start">
    <li>
      <div class="flex items-center">
        <Project class="flex-none p-2 w-10 h-10" />
        <span class="flex-1 ml-2">Projects</span>
        <a href="#new-project" class="flex-none" title="Add a new project">
          <Add class="w-6 h-6" />
        </a>
      </div>
      <ul>
        {#each $projects as project}
          <li class="py-2 pl-10 flex items-center">
            <span class="flex-1 ml-2">{project.name}</span>
            <button class="flex-none" on:click={() => add(project.id)}>
              <Add class="w-6 h-6" />
            </button>
          </li>
        {/each}
      </ul>
    </li>
  </ul>
  <footer class="flex justify-center">
    <DarkToggle />
  </footer>
</nav>
