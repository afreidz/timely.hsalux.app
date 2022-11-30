<script lang="ts">
  import timers from "../../stores/timers";
  import settings from "../../stores/settings";
  import viewDate from "../../stores/viewDate";
  import Field from "../../components/Field.svelte";
  import ProjectTimers from "./ProjectTimers.svelte";
  import Heading from "../../components/Heading.svelte";
  import Actions from "../../components/Actions.svelte";
  import type { Timer as TTimer } from "../../stores/timers";

  $: reportTimers = $timers.filter(
    (t) => !$settings?.hideInReports?.includes(t.project?.id)
  );

  function sumTimers(timers: TTimer[]) {
    return timers.reduce((p, c) => +p + +c.hours, 0);
  }
</script>

<svelte:head>
  <title>Daily report for: {$viewDate.toLocaleDateString("en")}</title>
</svelte:head>

<header class="view-heading">
  <Heading as="h4">
    Daily Report for
    {$viewDate.toLocaleDateString("en")}
  </Heading>
</header>
<Actions />
<section class="p-6">
  <div class="flex justify-center my-6">
    <ul class="flex-1 max-w-xl">
      <ProjectTimers timers={reportTimers} />
    </ul>
  </div>
  <footer>
    <h4 class={`pt-4 m-3 text-3xl border-t dark:border-black`}>Total:</h4>
    <div class={`flex justify-center`}>
      <Field label="Daily Hours" class={`flex-none w-[200px]`}>
        <span
          slot="custom"
          class={`my-4 flex flex-1 justify-center items-baseline text-4xl font-semibold`}
        >
          {sumTimers(reportTimers)}
          <small class="ml-1 text-sm font-normal opacity-50">hr</small>
        </span>
      </Field>
    </div>
  </footer>
</section>
