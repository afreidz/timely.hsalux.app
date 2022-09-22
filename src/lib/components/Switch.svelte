<script>
  import cl from "../helpers/classlist";
  import { createEventDispatcher } from "svelte";

  let dispatch = createEventDispatcher();
  let enabled = false;
  let label = "";
  let name;

  const classes = {
    input: cl`
      peer
      hidden
    `,
    container: cl`
      flex
      items-center
    `,
    label: cl`
      mr-2
    `,
    switch: cl`
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
      bg-neutral-700
      cursor-pointer
      transition-colors
      border-transparent
      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-white
      focus-visible:ring-opacity-75

      peer-checked:bg-blue-500
    `,
    pill: cl`
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
    `,
  };

  function handleChange(e) {
    enabled = e.target.checked;
    dispatch("change", enabled);
  }

  export { enabled, label, name };
</script>

<label class={classes.container}>
  <span class={classes.label}>{label}</span>
  <input
    {name}
    id={name}
    type="checkbox"
    checked={enabled}
    class={classes.input}
    on:change={handleChange}
  />
  <div class={classes.switch}>
    <span class="sr-only">{enabled ? "enabled" : "disabled"}</span>
    <span
      aria-hidden="true"
      class={classes.pill + ` ${enabled ? "translate-x-7" : "translate-x-0"}`}
    />
  </div>
</label>
