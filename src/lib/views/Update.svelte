<script lang="ts">
  import { marked } from "marked";
  import Icon from "@iconify/svelte";
  import subview from "../stores/subview";
  import Button from "../components/Button.svelte";
  import Heading from "../components/Heading.svelte";
  import { useRegisterSW } from "virtual:pwa-register/svelte";

  const { updateServiceWorker } = useRegisterSW();

  async function loadChanges() {
    const md = await (await fetch("/changes.md")).text();
    return marked(md);
  }

  async function handleUpdate() {
    await updateServiceWorker?.();
    window.location.hash = "";
  }
</script>

<svelte:head>
  <title>Update Available</title>
</svelte:head>

<header class="view-heading sitcky">
  <Heading as="h4">App Update Available!</Heading>
</header>
{#await loadChanges()}
  <section class="flex-1 flex flex-col justify-center items-center">
    <Icon icon="eos-icons:loading" class="h-6 w-6" />
  </section>
{:then changes}
  <section
    class={`
        m-6
        p-4
        prose
        w-full
        border
        mx-auto
        rounded-md
        bg-black/5
        overflow-auto
        prose-neutral
        dark:prose-invert
        dark:border-black
      `}
  >
    {@html changes}
  </section>
{/await}
<footer class="text-center">
  <Button on:click={() => handleUpdate()``}>Update Now!</Button>
</footer>
