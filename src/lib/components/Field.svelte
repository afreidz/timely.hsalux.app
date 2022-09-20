<script lang="ts">
  import cl from "../helpers/classlist";

  let props: any;
  let name: string;
  let label: string;
  let val: string = "";
  let required: boolean;

  const classes = {
    input: cl`
      p-3
      flex-1
      border
      bg-white
      rounded-lg
      outline-none
      border-gray-300

      dark:bg-neutral-700
      dark:border-black
      dark:focus:ring-offset-neutral-800

      focus:ring
      focus:ring-offset-2
      focus:ring-blue-500
`,
  };

  $: {
    props = { ...$$props };
    delete props.val;
    delete props.name;
    delete props.label;
    delete props.required;
  }

  export { label, name, val };
</script>

<fieldset
  class="py-3 px-4 mb-2 rounded-lg flex items-center bg-gray-100 dark:bg-neutral-800"
>
  <label class="flex-none w-52" for={name}>{label}</label>
  {#if Object.keys($$slots).length === 0}
    <input
      {...props}
      {name}
      id={name}
      {required}
      bind:value={val}
      class={classes.input}
    />
  {/if}
  <slot />
</fieldset>
