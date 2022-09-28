<script lang="ts">
  import Icon from "@iconify/svelte";
  import { isToday } from "../../helpers/date";
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
    <div
      class="my-6 grid grid-cols-[auto_auto] grid-rows-[auto_auto] sm:grid-cols-[9rem_auto_9rem] sm:grid-rows-[auto] items-center"
    >
      <div class="order-2 place-self-center sm:order-1">
        <Field
          bg={false}
          type="time"
          label="Start Time"
          val={timer.startString}
          on:change={(e) => (timer.startString = e.detail)}
        />
      </div>
      <div class="order-1 col-span-2 sm:order-2 sm:col-span-1">
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
            <span class="flex items-center justify-center whitespace-nowrap">
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
      <div class="order-3 place-self-end">
        <Field
          bg={false}
          type="time"
          label="End Time"
          val={timer.endString}
          on:change={(e) => (timer.endString = e.detail)}
        />
      </div>
    </div>
    <div class="flex justify-around">
      {#if timer.running}
        <Button on:click={() => startOrStop()} class="justify-self-center">
          <span class="flex items-center">
            <Icon icon="heroicons:stop-20-solid" class="h-4 w-4" />
            <span class="ml-1">Stop Timer</span>
          </span>
        </Button>
      {:else if isToday(timer.start)}
        <Button on:click={() => startOrStop()} class="justify-self-center">
          <span class="flex items-center">
            <Icon icon="heroicons:play-20-solid" class="h-4 w-4" />
            <span class="ml-1">Restart Timer</span>
          </span>
        </Button>
      {/if}
      <Button on:click={() => timer.delete()} class="bg-red-500">
        <span class="flex items-center">
          <Icon icon="heroicons:trash" class="h-4 w-4" />
          <span class="ml-1">Delete Timer</span>
        </span>
      </Button>
    </div>
  {/if}
</section>
