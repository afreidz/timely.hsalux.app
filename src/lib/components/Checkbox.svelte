<script lang="ts">
  import Icon from "@iconify/svelte";
  import { RadioGroupOption } from "@rgossiaux/svelte-headlessui";

  export let color = `blue-400`;
  export let size = 10;
</script>

<RadioGroupOption
  class={`
    mb-2
    mr-2
    flex
    w-${size}
    h-${size}
    rounded-lg
    focus:ring
    items-center
    justify-center
    bg-${color}-400
    focus:ring-offset-2
    focus:ring-blue-300

    dark:focus:ring-offset-neutral-800
  `}
  value={`${color}-400`}
  let:checked
>
  {#if checked}
    <Icon
      icon="heroicons:check-20-solid"
      class={`text-white w-${size - 2} h-${size - 2}`}
    />
  {/if}
</RadioGroupOption>
