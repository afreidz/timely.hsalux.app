<script type="ts">
  import { group } from "radash";
  import Icon from "@iconify/svelte";
  import * as api from "../../helpers/api";
  import { viewDate } from "../../stores/timers";
  import Field from "../../components/Field.svelte";
  import ProjectTimers from "./ProjectTimers.svelte";
  import Heading from "../../components/Heading.svelte";
  import { Timer, type ITimer } from "../../stores/timers";

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
    d.setMinutes(0, 0, 0);
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
      console.log(
        Object.entries(group(timers, (t: Timer) => `${t.start.getDay()}`))
      );
      return timers;
    });
</script>

<header class="view-heading">
  <Heading as="h4">Weekly Report</Heading>
</header>
<main class="p-4 overflow-auto w-full flex flex-nowrap">
  {#await timers}
    <Icon icon="eos-icons:loading" class="h-6 w-6" />
  {:then t}
    {#each Object.entries(group(t, (t) => `${t.start.getDay()}`)) as [day, timers]}
      <div class="min-w-[10rem] flex-shrink-0 flex-grow-0 mr-4">
        <Field label={dow[day]}>
          <div class="mt-4" slot="custom">
            <ProjectTimers {timers} />
            <footer
              class="mx-12 p-6 flex border-t text-3xl border-black dark:border-white"
            >
              <strong class="flex-1 font-light">Total:</strong>
              <small class="flex-none font-semibold">
                {sumTimers(timers)}
                <span class="font-normal opacity-50">hr</span>
              </small>
            </footer>
          </div>
        </Field>
      </div>
    {/each}
  {/await}
</main>
