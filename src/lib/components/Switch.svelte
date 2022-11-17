<script lang="ts">
  import { createEventDispatcher } from "svelte";

  let dispatch = createEventDispatcher();
  let enabled = false;
  let name: string;
  let label = "";

  function handleChange(e: { currentTarget: { checked: boolean } }) {
    enabled = e.currentTarget.checked;
    dispatch("change", enabled);
  }

  export { enabled, label, name };
</script>

<label class={`flex items-center ${$$props.class}`}>
  <span class={`mr-2`}>{label}</span>
  <input
    {name}
    id={name}
    type="checkbox"
    checked={enabled}
    class={`peer hidden`}
    on:change={handleChange}
  />
  <div
    class={`
      h-9
      flex
      relative
      w-[65px]
      shrink-0
      border-2
      shadow-xl
      ease-in-out
      align-middle
      rounded-full
      duration-200
      bg-neutral-800
      cursor-pointer
      transition-colors
      border-transparent
      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-white
      focus-visible:ring-opacity-75

      peer-checked:bg-blue-500
  `}
  >
    <span class="sr-only">{enabled ? "enabled" : "disabled"}</span>
    <span
      aria-hidden="true"
      class={`
        h-8
        w-8
        ring-0
        bg-white
        transform
        shadow-lg
        transition
        inline-grid
        ease-in-out
        rounded-full
        duration-200
        text-neutral-600
        pointer-events-none
        place-content-center

        ${enabled ? "translate-x-7" : "translate-x-0"}
      `}
    />
  </div>
</label>
