<script>
  import Add from "../icons/Add.svelte";
  import cl from "../helpers/classlist";
  import Logo from "../icons/Logo.svelte";
  import DarkToggle from "./DarkToggle.svelte";
  import Project from "../icons/Project.svelte";

  const navclass = cl`
    px-4
    grid
    flex-1
    text-white
    items-center
    grid-rows-[7rem_auto_5rem]
`;

  const listclass = cl`flex items-center`;
</script>

<nav class={navclass}>
  <h1 class="text-3xl font-thin flex justify-center">
    <Logo class="p-2 w-12 h-12 rounded-full bg-blue-500" />
    <span class="sr-only">Time.me</span>
  </h1>
  <ul class="self-start">
    <li class={listclass}>
      <Project class="flex-none p-2 w-10 h-10" />
      <span class="flex-1 ml-2">Projects</span>
      <a href="#new-project" title="Add a new project">
        <Add class="flex-none w-6 h-6"/>
      </a>
    </li>
  </ul>
  <footer class="flex justify-center">
    <DarkToggle />
  </footer>
</nav>

