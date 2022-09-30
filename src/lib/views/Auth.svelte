<script lang="ts">
  import Icon from "@iconify/svelte";
  import isweb from "../helpers/isweb";
  import cl from "../helpers/classlist";
  import { signin } from "../helpers/firebase/auth";

  let classes;
  $: classes = {
    overlay: cl`
      flex
      fixed
      top-0
      left-0
      right-0
      bottom-0
      items-center
      justify-center
      backdrop-blur-sm

      ${isweb ? "bg-white dark:bg-neutral-900" : "bg-transparent"}
  `,
    window: cl`
      mx-2
      flex
      p-10
      border
      w-full
      flex-col
      bg-white
      max-w-xl
      rounded-lg
      border-neutral-200

      dark:border-black
      dark:bg-neutral-800
`,
  };
</script>

<main class={classes.overlay}>
  <article class={classes.window}>
    <h1 class="mb-10 text-3xl font-thin flex justify-center text-white">
      <Icon
        icon="heroicons:bolt-20-solid"
        class="p-2 w-20 h-20 rounded-full bg-blue-500 shadow-xl"
      />
      <span class="sr-only">Time.me</span>
    </h1>
    <button class="p-6 flex bg-blue-500 rounded-md" on:click={() => signin()}>
      <Icon icon="logos:microsoft-icon" class="w-6 h-6 mr-4" />
      <span class="text-lg sm:text-xl font-light">Sign In with Microsoft</span>
    </button>
  </article>
</main>
