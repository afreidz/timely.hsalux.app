<script type="ts">
  import Icon from "@iconify/svelte";
  import { group, unique } from "radash";
  import * as api from "../../helpers/api";
  import settings from "../../stores/settings";
  import { viewDate } from "../../stores/timers";
  import forecasts from "../../stores/forecasts";
  import Field from "../../components/Field.svelte";
  import Actions from "../../components/Actions.svelte";
  import Heading from "../../components/Heading.svelte";
  import { Timer, type ITimer } from "../../stores/timers";
  import TimerComponent from "../../components/Timer.svelte";
  import { getSunday, getSaturday, dow } from "../../helpers/date";

  $: startDate = getSunday($viewDate);
  $: endDate = getSaturday($viewDate);

  function sumTimers(timers: Timer[]) {
    return timers.reduce((p, c) => +p + +c.hours, 0);
  }

  let timers: Promise<Timer[]>;
  $: timers = api
    .call(`/timers/range/${+startDate}/${+endDate}`)
    .then((timers) => timers.map((t: ITimer) => new Timer(t)))
    .then((timers) => {
      return timers.filter(
        (t: Timer) => !$settings?.hideInReports?.includes(t.project?.id)
      );
    });
</script>

<header class="view-heading items-center">
  <Heading as="h4" class={`flex-1`}>Weekly Report</Heading>
</header>
<Actions hideCal={true} hideToday={true} unit="week">
  <aside class="opacity-50 w-60 text-center">
    {startDate.toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}
    -
    {endDate.toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}
  </aside>
</Actions>
<main class="p-4 overflow-auto">
  {#await timers}
    <Icon icon="eos-icons:loading" class="h-6 w-6" />
  {:then t}
    {#each Object.entries(group(t, (t) => t.project?.name)) as [project, timers]}
      {#if project !== "undefined"}
        <TimerComponent
          class={`w-full sticky left-0`}
          color={timers[0].project?.color}
          project={timers[0].project?.name}
        >
          <div class="flex items-center">
            <span class="ml-2 text-base flex-1">
              {project}
            </span>
            <div class="justify-self-end flex flex-none items-center gap-3">
              <small class="font-semibold text-base">
                <span class="text-sm font-normal opacity-50"
                  >Weekly Worked:</span
                >
                {sumTimers(timers)}
                <span class="text-sm font-normal opacity-50">hr</span>
              </small>
              {#if $forecasts[timers[0].project?.id]}
                |
                <small class="font-semibold text-base">
                  <span class="text-sm font-normal opacity-50"
                    >Weekly Forecast:</span
                  >
                  {$forecasts[timers[0].project?.id]?.hours}
                  <span class="text-sm font-normal opacity-50">hr</span>
                </small>
              {/if}
              {#if timers[0].project?.budget}
                {#await timers[0].project.calculateHours()}
                  <Icon icon="eos-icons:loading" class="h-4 w-4" />
                {:then hours}
                  |
                  <small class="font-semibold text-base">
                    <span class="text-sm font-normal opacity-50"
                      >Project Budget:</span
                    >
                    {timers[0].project.budget - hours}
                    <span class="text-sm font-normal opacity-50">of</span>
                    {timers[0].project.budget}
                    <span class="text-sm font-normal opacity-50">hr</span>
                  </small>
                {/await}
              {/if}
            </div>
          </div>
        </TimerComponent>
        <div class={`m-3 mb-5 flex flex-1 justify-stretch gap-3`}>
          {#each dow as day, index}
            <Field
              label={`${day} ${new Date(
                new Date(startDate).setHours(24 * index)
              ).getDate()}`}
              class={`flex-grow flex-shrink-0 w-[140px]`}
            >
              <span
                slot="custom"
                class={`my-4 flex flex-1 justify-center items-baseline text-xl font-semibold`}
              >
                {sumTimers(timers.filter((t) => dow[t.start.getDay()] === day))}
                <small class="ml-1 text-sm font-normal opacity-50">hr</small>
              </span>
              <ul slot="lower" class={`mb-4 text-xs opacity-50`}>
                {#each unique( timers.filter((t) => dow[t.start.getDay()] === day), (t) => t.task ) as timer}
                  {#if timer.task !== "Timer"}
                    <li class="line-clamp-1" title={timer.task}>
                      • {timer.task}
                    </li>
                  {/if}
                {/each}
              </ul>
            </Field>
          {/each}
        </div>
      {/if}
    {/each}
    <h4 class={`pt-4 m-3 text-3xl border-t dark:border-black`}>Totals:</h4>
    <div class={`m-3 flex flex-1 justify-stretch gap-3`}>
      {#each dow as day, index}
        <Field
          label={`${day} ${new Date(
            new Date(startDate).setHours(24 * index)
          ).getDate()}`}
          class="flex-grow flex-shrink-0 w-[140px]"
        >
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
    <div class={`p-4 flex justify-center`}>
      <Field label="Weekly Hours" class={`flex-none w-[200px]`}>
        <span
          slot="custom"
          class={`my-4 flex flex-1 justify-center items-baseline text-4xl font-semibold`}
        >
          {sumTimers(t)}
          <small class="ml-1 text-sm font-normal opacity-50">hr</small>
        </span>
      </Field>
    </div>
  {/await}
</main>
