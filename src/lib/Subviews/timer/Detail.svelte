<script lang="ts">
  import Icon from "@iconify/svelte";
  import Field from "../../components/Field.svelte";
  import Button from "../../components/Button.svelte";
  import Heading from "../../components/Heading.svelte";
  import { timers, type Timer } from "../../stores/timers";

  export let id: string;
  let timer: Timer;

  $: timer = $timers.find((t) => t.id === id);

  function update() {
    timer.refresh();
    window.location.hash = "";
  }
</script>

<section class="p-6 flex flex-col flex-1">
  <Heading as="h4" variant="section">Timer Details</Heading>
  <form
    class="mt-6 flex flex-col flex-1"
    on:submit|preventDefault={() => update()}
  >
    <div class="flex-1">
      <Field name="timerTask" label="Task Name" bind:val={timer.task} />
      <Field label="Duration">
        <span class="text-3xl">
          {Math.round(timer.duration / 1000 / 60)} mins
        </span>
      </Field>
    </div>
    <footer class="flex flex-none justify-end">
      {#if timer.running}
        <Button
          title="stop timer"
          on:click={() => timer.stop()}
          class="bg-red-500 flex items-center"
        >
          <Icon icon="heroicons:stop-20-solid" class="h-8 w-8 mr-2" />
          <span class="text-xl">Stop Timer</span>
        </Button>
      {/if}
      <Button>
        <span class="inline-block text-xl p-4">Update</span>
      </Button>
    </footer>
  </form>
</section>
