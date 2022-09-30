<script lang="ts">
  import cl from "../helpers/classlist";
  import { createEventDispatcher } from "svelte";

  let classes;
  let props: any;
  let val: string = "";
  let readonly: boolean;
  let required: boolean;
  let bg: boolean = true;
  let name: string = null;
  let label: string = null;
  let dispatch = createEventDispatcher();

  $: classes = {
    container: cl`
      my-1
      grid
      relative
      rounded-lg
      items-center
      border-white
      grid-rows-[auto_auto]

      ${$$slots.icon ? "grid-cols-[2.5rem_auto]" : "grid-cols-[auto]"}
      
      ${bg ? "px-4" : ""}
      ${bg ? "border" : ""}
      ${bg ? "bg-neutral-50" : ""}
      ${bg ? "dark:border-black" : ""}
      ${bg ? "dark:bg-neutral-700" : ""}
      
      focus-within:ring-2
      focus-within:ring-blue-500
    `,
    field: cl`
      pb-2
      flex
      flex-1
      relative
      self-stretch
      ${!!label ? "pt-6" : "pt-4"}
    `,
    label: cl`
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
      flex
      my-2
      flex-1
      flex-col
      self-end
      text-black
      justify-center
      dark:text-white
    `,
    input: cl`
      peer
      flex-1 
      leading-10
      text-black
      self-stretch
      outline-none
      bg-transparent
      dark:text-white
    `,
    switch: cl`
      flex  
      flex-1
      items-stretch
    `,
  };

  $: {
    props = { ...$$props };
    delete props.val;
    delete props.name;
    delete props.label;
  }

  export { label, name, val, bg };
</script>

<label class={classes.container}>
  <slot name="icon" />
  <div class={classes.field}>
    {#if $$slots.custom}
      <slot name="custom" />
    {:else if $$slots.readonly}
      <div class={classes.readonly}>
        <slot name="readonly" />
      </div>
    {:else if readonly}
      <input
        {...props}
        {name}
        id={name}
        value={val}
        placeholder=" "
        class={classes.input}
        on:change={(e) => dispatch("change", e.target.value)}
      />
    {:else}
      <input
        {...props}
        {name}
        id={name}
        bind:value={val}
        placeholder=" "
        class={classes.input}
        on:change={(e) => dispatch("change", e.target.value)}
      />
    {/if}
    {#if label}<span class={classes.label}>{label}</span>{/if}
  </div>
  {#if $$slots.lower}
    <footer class="col-span-full flex">
      <slot name="lower" />
    </footer>
  {/if}
</label>

<style lang="postcss">
  input[type="time"]::-webkit-calendar-picker-indicator {
    opacity: 0;
  }
</style>
