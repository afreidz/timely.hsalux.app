<script lang="ts">
  import nav from "../stores/nav";
  import Icon from "@iconify/svelte";
  import cl from "../helpers/classlist";

  let classlist;
  $: classlist = cl`
    flex
    text-3xl
    border-b
    border-r
    font-thin
    text-white
    items-center
    border-white
    justify-center

    dark:border-black
    dark:bg-neutral-900

    ${$$props.class}
  `;
</script>

<h1 class={classlist}>
  <button on:click={() => ($nav = !$nav)}>
    <Icon
      icon="heroicons:bolt-20-solid"
      class="p-2 w-12 h-12 rounded-full bg-blue-500"
    />
  </button>
  <span class="sr-only">Time.me</span>
</h1>
