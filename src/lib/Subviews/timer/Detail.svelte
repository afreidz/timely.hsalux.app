<script lang="ts">
  import { timers, type Timer } from "../../stores/timers";
  import Field from "../../components/Field.svelte";
  import Button from "../../components/Button.svelte";
  import Heading from "../../components/Heading.svelte";

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
    </div>
    <footer class="flex flex-none justify-end">
      <Button>
        <span class="inline-block text-xl p-4">Update</span>
      </Button>
    </footer>
  </form>
</section>
