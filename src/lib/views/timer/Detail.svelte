<script lang="ts">
  import Icon from "@iconify/svelte";
  import Timer from "../../components/Timer.svelte";
  import Field from "../../components/Field.svelte";
  import Button from "../../components/Button.svelte";
  import Heading from "../../components/Heading.svelte";
  import timers, { type Timer } from "../../stores/timers";

  export let id: string;
  let timer: Timer;

  $: timer = $timers.find((t) => t.id === id);
  $: if (!timer) window.location.hash = "";

  function startOrStop() {
    if (timer.running) {
      timer.stop();
    } else {
      timer.unstop();
    }
  }
</script>

<section class="p-6 flex-1">
  <header class="mb-4">
    <Heading as="h4" variant="section">Timer Details</Heading>
  </header>
  {#if timer}
    <Field
      name="timerTask"
      label="Task Name"
      val={timer.task}
      on:change={(e) => (timer.task = e.detail)}
    />
    <Field label="Project">
      <span slot="readonly">
        {timer.project.name}
      </span>
    </Field>
    <div class="flex my-10">
      <div class="flex-none w-36 flex justify-center">
        <Field
          bg={false}
          type="time"
          label="Start Time"
          bind:val={timer.startString}
          on:change={(e) => (timer.startString = e.detail)}
        />
      </div>
      <div class="flex-1 mt-2">
        <Timer
          hideChip={true}
          color={timer.project.color}
          project={timer.project.name}
        >
          <div class="flex-1 grid grid-cols-[2rem_2rem_auto_2rem_2rem]">
            <button on:click={() => timer.shiftStart()}>
              <Icon
                icon="heroicons:chevron-double-left-20-solid"
                class="h-8 w-8"
              />
            </button>
            <button on:click={() => timer.unshiftStart()}>
              <Icon
                icon="heroicons:chevron-double-right-20-solid"
                class="h-8 w-8"
              />
            </button>
            <span class="flex items-center justify-center">
              {timer.hours} hours {#if timer.running}(running){/if}
            </span>
            {#if !timer.running}
              <button on:click={() => timer.unshiftEnd()}>
                <Icon
                  icon="heroicons:chevron-double-left-20-solid"
                  class="h-8 w-8"
                />
              </button>
              <button on:click={() => timer.shiftEnd()}>
                <Icon
                  icon="heroicons:chevron-double-right-20-solid"
                  class="h-8 w-8"
                />
              </button>
            {/if}
          </div>
        </Timer>
      </div>
      <div class="flex-none w-36 flex justify-center">
        <Field
          bg={false}
          type="time"
          label="End Time"
          bind:val={timer.endString}
          on:change={(e) => (timer.endString = e.detail)}
        />
      </div>
    </div>
    <div class="flex justify-between">
      <Button on:click={() => startOrStop()} class="justify-self-center">
        {#if timer.running}
          <span class="flex items-center py-4">
            <Icon icon="heroicons:stop-20-solid" class="h-4 w-4" />
            <span class="ml-1">Stop Timer</span>
          </span>
        {:else}
          <span class="flex items-center py-4">
            <Icon icon="heroicons:play-20-solid" class="h-4 w-4" />
            <span class="ml-1">Restart Timer</span>
          </span>
        {/if}
      </Button>
      <Button on:click={() => timer.delete()} class="bg-red-500">
        <span class="flex items-center py-4">
          <Icon icon="heroicons:trash" class="h-4 w-4" />
          <span class="ml-1">Delete Timer</span>
        </span>
      </Button>
    </div>
  {/if}
</section>
