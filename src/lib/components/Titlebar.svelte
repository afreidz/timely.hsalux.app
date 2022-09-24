<script lang="ts">
  import auth from "../stores/auth";
  import Icon from "@iconify/svelte";
  import { signin } from "../helpers/firebase/auth";
  import { appWindow } from "@tauri-apps/api/window";
</script>

<header
  data-tauri-drag-region
  class="m-1 flex fixed top-0 left-0 right-0 z-50 select-none justify-end"
>
  {#if $auth}
    Hello {$auth?.email}!
  {:else}
    <button on:click={() => signin()}>Sign In</button>
  {/if}
  <button
    class="p-3 inline-flex items-center justify-center hover:bg-red-500 transition-colors rounded-sm"
    on:click={() => appWindow.close()}
  >
    <Icon icon="mi:close" alt="close" />
  </button>
</header>
