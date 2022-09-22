<script lang="ts">
  import cl from "../helpers/classlist";
  import { createEventDispatcher } from "svelte";

  let classes;
  let props: any;
  let label: string;
  let val: string = "";
  let required: boolean;
  let bg: boolean = true;
  let name: string = null;
  let dispatch = createEventDispatcher();

  $: classes = {
    container: cl`
      my-1
      h-16
      flex
      relative
      rounded-lg
      items-center
      border-white
      
      ${bg ? "px-4" : ""}
      ${bg ? "border" : ""}
      ${bg ? "bg-neutral-50" : ""}
      ${bg ? "dark:border-black" : ""}
      ${bg ? "dark:bg-neutral-700" : ""}

      focus-within:ring-2
      focus-within:ring-blue-500
    `,
    field: cl`
      flex
      flex1 
      flex-col 
    `,
    label: cl`
      h-16
      flex
      absolute
      scale-75
      opacity-50
      origin-left
      items-center
      duration-200
      -translate-y-4
      transition-all
      whitespace-nowrap
      
      peer-focus:scale-75
      peer-focus:opacity-100
      peer-focus:text-blue-500
      peer-focus:-translate-y-4
      peer-placeholder-shown:scale-100
      peer-placeholder-shown:opacity-100
      peer-placeholder-shown:translate-y-0
    `,
    readonly: cl`
      h-12
      flex
      flex-1
      flex-col
      self-end
      text-black
      justify-center
      dark:text-white
    `,
    input: cl`
      peer
      h-12
      flex-1
      self-end
      text-black
      outline-none
      bg-transparent
      dark:text-white
    `,
  };

  $: {
    props = { ...$$props };
    delete props.val;
    delete props.name;
    delete props.label;
    delete props.required;
  }

  export { label, name, val, bg };
</script>

<label class={classes.container}>
  <slot name="icon" />
  <div class="flex flex-1 relative self-stretch">
    {#if $$slots.readonly}
      <div class={classes.readonly}>
        <slot name="readonly" />
      </div>
    {:else}
      <input
        {...props}
        {name}
        id={name}
        {required}
        placeholder=" "
        bind:value={val}
        class={classes.input}
        on:change={(e) => dispatch("change", e.target.value)}
      />
    {/if}
    <span class={classes.label}>{label}</span>
  </div>
</label>

<style lang="postcss">
  input[type="time"]::-webkit-calendar-picker-indicator {
    opacity: 0;
  }
</style>
