<script lang="ts">
  import Icon from "@iconify/svelte";
  import { appWindow } from "@tauri-apps/api/window";
</script>

<header
  data-tauri-drag-region
  class={`
    m-1
    z-50
    flex
    fixed
    top-0
    left-0 
    right-0
    select-none 
    justify-end
  `}
>
  <button
    class={`
      p-3
      rounded-sm
      inline-flex
      items-center
      justify-center
      hover:bg-red-500
      transition-colors
    `}
    on:click={() => appWindow.close()}
  >
    <Icon icon="mi:close" alt="close" />
  </button>
</header>
