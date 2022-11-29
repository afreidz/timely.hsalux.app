<script lang="ts">
  let project = "?";
  let hideChip = false;
  let color = "neutral-800";

  export { project, color, hideChip };
</script>

<div
  class={`
    h-12
    px-3
    flex
    w-full
    items-center
    rounded-full
    justify-start
    bg-${color}

    ${$$props.class}
  `}
>
  {#if !hideChip}
    <span
      class={`
        h-6
        w-6
        flex
        bg-white
        rounded-full
        items-center
        justify-center
        text-${color}
      `}>{project.charAt(0) || "?"}</span
    >
  {/if}
  <strong
    class={`
      flex
      flex-1
      text-xs
      text-white
      font-normal
      line-clamp-1
  `}><slot /></strong
  >
</div>
