<script lang="ts">
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";

  let props: any;
  let readonly: boolean;
  let bg: boolean = true;
  let name: string = null;
  let label: string = null;
  let dirty: boolean = false;
  let input: HTMLInputElement;
  let val: string | number = "";
  let dispatch = createEventDispatcher();
  let changeType: "commit" | "input" = "input";

  $: {
    props = { ...$$props };
    delete props.val;
    delete props.name;
    delete props.label;
  }

  export { label, name, val, bg, changeType };
</script>

<label
  class={`
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

    ${props.class ?? ""}
`}
>
  <slot name="icon" />
  <div
    class={`
      pb-2
      flex
      flex-1
      relative
      self-stretch
      ${!!label ? "pt-6" : "pt-2"}
  `}
  >
    {#if $$slots.custom}
      <slot name="custom" />
    {:else if $$slots.readonly}
      <div
        class={`
          flex
          my-2
          flex-1
          flex-col
          self-end
          text-black
          justify-center
          dark:text-white
      `}
      >
        <slot name="readonly" />
      </div>
    {:else if readonly}
      <input
        {...props}
        {name}
        id={name}
        readonly
        value={val}
        placeholder=" "
        bind:this={input}
        class={`peer ${props.class ?? ""}`}
      />
    {:else}
      <input
        {...props}
        {name}
        id={name}
        bind:value={val}
        placeholder=" "
        bind:this={input}
        class={`peer ${props.class ?? ""}`}
        on:input={(e) => (dirty = e.currentTarget.value === val)}
        on:change={(e) => {
          if (changeType === "input") {
            dispatch("change", e.currentTarget.value);
          }
        }}
      />
    {/if}
    {#if label}
      <span
        class={`
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
      `}>{label}</span
      >
    {/if}
    {#if dirty && changeType === "commit"}
      <button
        class="ml-3 bg-black/10 rounded-md px-3 hover:bg-emerald-500 transition-colors"
        on:click={() => {
          dispatch("change", input?.value);
          dirty = false;
        }}
      >
        <Icon icon="heroicons:check" />
      </button>
    {/if}
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
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 100px rgb(250, 250, 250) inset !important;
    -webkit-text-fill-color: black !important;
  }

  :global(.dark) input:-webkit-autofill,
  :global(.dark) input:-webkit-autofill:hover,
  :global(.dark) input:-webkit-autofill:focus,
  :global(.dark) input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 100px rgb(64, 64, 64) inset !important;
    -webkit-text-fill-color: white !important;
  }

  label :global(input),
  label :global(select) {
    @apply flex-1 text-black self-stretch outline-none leading-[2.5] bg-transparent;
  }

  :global(.dark) label :global(input),
  :global(.dark) label :global(select) {
    @apply text-white;
  }
</style>
