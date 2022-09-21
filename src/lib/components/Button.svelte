<script lang="ts">
  import cl from "../helpers/classlist";

  const classlist = cl`
    m-4
    px-7
    shadow-md
    text-white
    bg-blue-500
    font-medium
    rounded-full
    transition-all
    active:bg-blue-600
    active:translate-y-px
`;
</script>

<button {...$$props} on:click class={`${classlist} ${$$props.class}`}>
  <slot />
</button>
