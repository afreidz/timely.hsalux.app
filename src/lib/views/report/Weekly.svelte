<script type="ts">
  import { group } from "radash";
  import Icon from "@iconify/svelte";
  import * as api from "../../helpers/api";
  import settings from "../../stores/settings";
  import { viewDate } from "../../stores/timers";
  import Field from "../../components/Field.svelte";
  import Heading from "../../components/Heading.svelte";
  import { Timer, type ITimer } from "../../stores/timers";
  import TimerComponent from "../../components/Timer.svelte";

  const dow = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let startDate = getMonday($viewDate);
  let endDate = getFriday($viewDate);

  function getMonday(d: Date) {
    d = new Date(d);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay() || 7;
    if (day !== 1) d.setHours(-24 * (day - 1));
    return d;
  }

  function getFriday(d: Date) {
    const nd = getMonday(d);
    nd.setDate(nd.getDate() + 4);
    nd.setHours(23, 59, 59, 0);
    return nd;
  }

  function sumTimers(timers: Timer[]) {
    return timers.reduce((p, c) => +p + +c.hours, 0);
  }

  let timers: Promise<Timer[]>;
  $: timers = api
    .call(`/timers/range/${+startDate}/${+endDate}`)
    .then((timers) => timers.map((t: ITimer) => new Timer(t)))
    .then((timers) => {
      return timers.filter(
        (t: Timer) => !$settings?.hideInReports?.includes(t.project.id)
      );
    });
</script>

<header class="view-heading">
  <Heading as="h4">Weekly Report</Heading>
</header>
<main class="p-4 overflow-auto w-full flex flex-col">
  {#await timers}
    <Icon icon="eos-icons:loading" class="h-6 w-6" />
  {:then t}
    {#each Object.entries(group(t, (t) => t.project.name)) as [project, timers]}
      <section class={`mb-5`}>
        <TimerComponent
          color={timers[0].project?.color}
          project={timers[0].project?.name}
        >
          <div class="grid grid-cols-[auto_8rem] items-center">
            <span class="ml-2 text-base">
              {project}
            </span>
            <small class="font-semibold text-base justify-self-end">
              {sumTimers(timers)}
              <span class="text-sm font-normal opacity-50">hr</span>
            </small>
          </div>
        </TimerComponent>
        <div class={`m-3 flex flex-1 justify-stretch gap-3`}>
          {#each dow as day}
            <Field label={day} class="flex-1">
              <span
                slot="custom"
                class={`my-4 flex flex-1 justify-center items-baseline text-xl font-semibold`}
              >
                {sumTimers(timers.filter((t) => dow[t.start.getDay()] === day))}
                <small class="ml-1 text-sm font-normal opacity-50">hr</small>
              </span>
              <ul slot="lower" class={`mb-4 text-xs opacity-50`}>
                {#each timers.filter((t) => dow[t.start.getDay()] === day) as timer}
                  {#if timer.task !== "Timer"}
                    <li class="line-clamp-1">- {timer.task}</li>
                  {/if}
                {/each}
              </ul>
            </Field>
          {/each}
        </div>
      </section>
    {/each}
    <h4 class={`my-3 text-3xl text-center`}>Totals</h4>
    <hr />
    <div class={`m-3 flex flex-1 justify-stretch gap-3`}>
      {#each dow as day, index}
        <Field label={day} class="flex-1">
          <span
            slot="custom"
            class={`my-4 flex flex-1 justify-center items-baseline text-2xl font-semibold`}
          >
            {sumTimers(t.filter((t) => t.start.getDay() === index))}
            <small class="ml-1 text-lg font-normal opacity-50">hr</small>
          </span>
        </Field>
      {/each}
    </div>
  {/await}
</main>
