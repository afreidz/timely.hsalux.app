<script lang="ts">
  import timers from "../../stores/timers";
  import settings from "../../stores/settings";
  import viewDate from "../../stores/viewDate";
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
  <footer
    class="mx-12 p-6 flex border-t text-3xl border-black dark:border-white"
  >
    <strong class="flex-1 font-light">Total:</strong>
    <small class="flex-none font-semibold">
      {sumTimers(reportTimers)}
      <span class="font-normal opacity-50">hr</span>
    </small>
  </footer>
</section>
