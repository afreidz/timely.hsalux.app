<script lang="ts">
  import Icon from "@iconify/svelte";

  let message: string = null;

  export { message };
</script>

{#if message}
  <div
    class={`
        p-6
        flex
        gap-4
        border-2
        absolute
        left-[50%]
        rounded-md
        bg-red-200
        top-[2rem]
        items-center
        text-red-500
        border-red-500
        -translate-x-1/2
      `}
  >
    <span>
      {message}
    </span>
    <button
      class={`
          m-1
          w-8 h-8
          rounded-sm
          bg-white/10
          inline-flex
          items-center
          justify-center
          hover:bg-red-500
          hover:text-white
          transition-colors
        `}
      on:click={() => (message = null)}
    >
      <Icon icon="mi:close" alt="close" />
    </button>
  </div>
{/if}
