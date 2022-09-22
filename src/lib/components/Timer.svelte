<script lang="ts">
  import cl from "../helpers/classlist";

  let project = "?";
  let hideChip = false;
  let color = "neutral-800";

  const classes = {
    pill: cl`
      h-12
      px-3
      flex
      w-full
      items-center
      rounded-full
      justify-start
    `,
    chip: cl`
      h-6
      w-6
      flex
      bg-white
      rounded-full
      items-center
      justify-center
    `,
    text: cl`
      flex
      flex-1
      text-xs
      text-white
      font-normal
      line-clamp-1
    `,
  };

  export { project, color, hideChip };
</script>

<div class={classes.pill + ` bg-${color}`}>
  {#if !hideChip}
    <span class={classes.chip + ` text-${color}`}>{project.charAt(0)}</span>
  {/if}
  <strong class={classes.text}><slot /></strong>
</div>
