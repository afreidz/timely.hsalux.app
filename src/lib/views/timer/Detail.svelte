<script lang="ts">
  import Icon from "@iconify/svelte";
  import cl from "../../helpers/classlist";
  import subview from "../../stores/subview";
  import settings from "../../stores/settings";
  import { isToday } from "../../helpers/date";
  import Hours from "../../components/Hours.svelte";
  import Timer from "../../components/Timer.svelte";
  import Field from "../../components/Field.svelte";
  import Button from "../../components/Button.svelte";
  import Heading from "../../components/Heading.svelte";
  import timers, { type Timer } from "../../stores/timers";

  export let id: string;
  let timer: Timer;

  $: timer = $timers.find((t) => t.id === id);
  $: if (!timer) {
    $subview = null;
    window.location.hash = "";
  }

  function changeStart(e) {
    const [hh, mm] = e.detail.split(":");
    const newStart = new Date(timer.start);

    newStart.setHours(+hh);
    newStart.setMinutes(+mm);

    timer.start = newStart;
  }

  function changeEnd(e) {
    const [hh, mm] = e.detail.split(":");
    const newEnd = new Date(timer.start);

    newEnd.setHours(+hh);
    newEnd.setMinutes(+mm);

    timer.end = newEnd;
  }

  function dateToString(d: Date) {
    return `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(
      -2
    )}`;
  }

  function shiftStart(min = 5) {
    const shiftAmount = Math.abs(min);
    const shiftDirection = min > 0 ? 1 : -1;
    const newStart = new Date(
      +timer.start + 1000 * 60 * shiftAmount * shiftDirection
    );

    if (shiftDirection > 0 && +timer.end - +newStart <= 1000 * 60) return;
    timer.start = newStart;
  }

  function shiftEnd(min = 5) {
    if (timer.running) return;
    const shiftAmount = Math.abs(min);
    const shiftDirection = min > 0 ? 1 : -1;
    const newEnd = new Date(
      +timer.end + 1000 * 60 * shiftAmount * shiftDirection
    );

    if (shiftDirection < 1 && +newEnd - +timer.start <= 1000 * 60) return;
    timer.end = newEnd;
  }
</script>

<svelte:head>
  <title
    >Details for: {timer?.project?.name || ""} - {timer?.project?.task ||
      ""}</title
  >
</svelte:head>

<header class="view-heading">
  <Heading as="h4">Timer Details</Heading>
</header>
<section class="p-6 flex-1 flex flex-col">
  {#if timer}
    <Field
      val={timer.task}
      name="timerTask"
      label="Task Name"
      on:change={(e) => (timer.task = e.detail)}
    />
    <Field label="Project">
      <span slot="readonly">
        {timer.project.name}
      </span>
    </Field>
    <div
      class={cl`
        my-6
        grid
        items-center
        grid-cols-[auto_auto]
        grid-rows-[auto_auto]
        
        sm:grid-rows-[auto]
        sm:grid-cols-[9rem_auto_9rem]
        `}
    >
      <div class="order-2 place-self-center sm:order-1">
        <Field
          bg={false}
          type="time"
          label="Start Time"
          on:change={changeStart}
          val={dateToString(timer.start)}
        />
      </div>
      <div class="order-1 col-span-2 sm:order-2 sm:col-span-1">
        <Timer
          hideChip={true}
          color={timer.project.color}
          project={timer.project.name}
        >
          <div class="flex-1 grid grid-cols-[2rem_2rem_auto_2rem_2rem]">
            <button on:click={() => shiftStart(-5)}>
              <Icon
                icon="heroicons:chevron-double-left-20-solid"
                class="h-8 w-8"
              />
            </button>
            <button on:click={() => shiftStart(5)}>
              <Icon
                icon="heroicons:chevron-double-right-20-solid"
                class="h-8 w-8"
              />
            </button>
            <span class="flex items-center justify-center whitespace-nowrap">
              {timer.hours} hours {#if timer.running}(running){/if}
            </span>
            {#if !timer.running}
              <button on:click={() => shiftEnd(-5)}>
                <Icon
                  icon="heroicons:chevron-double-left-20-solid"
                  class="h-8 w-8"
                />
              </button>
              <button on:click={() => shiftEnd(5)}>
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
          on:change={changeEnd}
          val={dateToString(timer.end)}
        />
      </div>
    </div>
    <div class="flex-1 flex flex-col items-center justify-center">
      {#if $settings.showHours?.includes(timer.project.id)}
        <Hours project={timer.project} readonly />
      {/if}
    </div>
    <div class="flex justify-around">
      {#if timer.running}
        <Button on:click={() => timer.stop()} class="justify-self-center">
          <span class="flex items-center">
            <Icon icon="heroicons:stop-20-solid" class="h-4 w-4" />
            <span class="ml-1">Stop Timer</span>
          </span>
        </Button>
      {:else if isToday(timer.start)}
        <Button on:click={() => timer.unstop()} class="justify-self-center">
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
