<script lang="ts">
  import cl from "../helpers/classlist";

  const classlist = cl`
    m-4
    p-4
    text-sm
    shadow-md
    text-white
    bg-blue-500
    rounded-full
    transition-all
    whitespace-nowrap
    active:translate-y-px

    sm:px-7
    sm:text-base
`;
</script>

<button {...$$props} on:click class={`${classlist} ${$$props.class}`}>
  <slot />
</button>
