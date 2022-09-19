<script lang="ts">
  import cl from "../helpers/classlist";
  import Check from "../icons/Check.svelte";
  import { RadioGroupOption } from "@rgossiaux/svelte-headlessui";

  export let color = `blue-400`;
  export let size = 10;

  const forceLoad = [
    cl`bg-red-400`,
    cl`bg-sky-400`,
    cl`bg-rose-400`,
    cl`bg-gray-400`,
    cl`bg-lime-400`,
    cl`bg-teal-400`,
    cl`bg-blue-400`,
    cl`bg-cyan-400`,
    cl`bg-pink-400`,
    cl`bg-slate-400`,
    cl`bg-stone-400`,
    cl`bg-amber-400`,
    cl`bg-green-400`,
    cl`bg-orange-400`,
    cl`bg-yellow-400`,
    cl`bg-indigo-400`,
    cl`bg-violet-400`,
    cl`bg-purple-400`,
    cl`bg-emerald-400`,
    cl`bg-fuchsia-400`,
    cl`text-red-400`,
    cl`text-sky-400`,
    cl`text-rose-400`,
    cl`text-gray-400`,
    cl`text-lime-400`,
    cl`text-teal-400`,
    cl`text-blue-400`,
    cl`text-cyan-400`,
    cl`text-pink-400`,
    cl`text-slate-400`,
    cl`text-stone-400`,
    cl`text-amber-400`,
    cl`text-green-400`,
    cl`text-orange-400`,
    cl`text-yellow-400`,
    cl`text-indigo-400`,
    cl`text-violet-400`,
    cl`text-purple-400`,
    cl`text-emerald-400`,
    cl`text-fuchsia-400`,
  ];
</script>

<RadioGroupOption
  class={`mb-2 mr-2 bg-${color}-400 w-${size} h-${size} rounded-lg flex justify-center items-center focus:ring focus:ring-offset-2 focus:ring-blue-300`}
  value={`${color}-400`}
  let:checked
>
  <span
    class:checked
    class={`text-white invisible w-${size - 2} h-${size - 2}`}
  >
    <Check />
  </span>
</RadioGroupOption>

<style>
  .checked {
    visibility: visible !important;
  }
</style>
