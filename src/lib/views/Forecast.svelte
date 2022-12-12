<script lang="ts">
  import Icon from "@iconify/svelte";
  import viewDate from "../stores/viewDate";
  import Timer from "../components/Timer.svelte";
  import Field from "../components/Field.svelte";
  import Actions from "../components/Actions.svelte";
  import Heading from "../components/Heading.svelte";
  import { getSaturday, getSunday } from "../helpers/date";
  import projects, { Project, load as loadProjects } from "../stores/projects";
  import forecasts, {
    add,
    Forecast,
    load as loadForecasts,
  } from "../stores/forecasts";

  $: startDate = getSunday($viewDate);
  $: endDate = getSaturday($viewDate);
  $: console.log("Forecasts", $forecasts);

  async function updateHours(project: Project, hours: number) {
    const existing = Forecast.getByProject(project.id);
    if (!existing) {
      await add(project.id, $viewDate, hours);
    } else {
      existing.hours = hours;
    }
  }

  async function load() {
    await loadProjects();
    await loadForecasts();
    return;
  }
</script>

<header class="view-heading">
  <Heading as="h4">Weekly Forecasts</Heading>
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
<section class="p-6">
  {#await load()}
    <Icon icon="eos-icons:loading" class="w-6 h-6" />
  {:then}
    {#each $projects as project}
      <div class="flex items-center gap-4">
        <Timer
          color={project.color}
          project={project.name}
          class="flex-none w-1/2"
        >
          <span class={`mx-2`}>
            {project.name}
          </span>
        </Timer>
        <Field
          min="0"
          step="1"
          type="number"
          label="Hours"
          changeType="commit"
          class="text-xl text-center flex-none"
          val={$forecasts[project.id]?.hours || 0}
          on:change={(e) => updateHours(project, e.detail)}
        />
      </div>
    {/each}
  {/await}
</section>
