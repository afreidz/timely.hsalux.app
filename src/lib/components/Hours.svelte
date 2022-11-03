<script lang="ts">
  import Icon from "@iconify/svelte";
  import Field from "./Field.svelte";
  import type { Project } from "../stores/projects";

  let project: Project;
  let readonly = false;
  let hours: Promise<any>;

  $: if (project) {
    hours = project.calculateHours();
  }

  export { project, readonly };
</script>

<strong class="text-2xl font-light mb-4">Project Hours</strong>
<div class="w-full max-w-xs">
  {#if readonly}
    <Field readonly label="Budgeted">
      <span slot="readonly" class="text-2xl text-center">{project.budget}</span>
    </Field>
  {:else}
    <Field
      min="0"
      step="1"
      type="number"
      label="Budgeted"
      changeType="commit"
      name="projectBudget"
      val={project.budget}
      class="text-2xl text-center"
      on:change={(e) => (project.budget = e.detail)}
    />
  {/if}
</div>
<div class="w-full max-w-xs">
  <Field readonly label="Recorded">
    <div slot="readonly">
      <span class="flex text-2xl items-center justify-center">
        {#if hours}
          {#await hours}
            <Icon icon="eos-icons:loading" class="w-8 h-8" />
          {:then hours}
            {hours}
          {/await}
        {/if}
      </span>
    </div>
  </Field>
</div>
<div
  class="w-full max-w-xs border-t mt-4 py-6 flex text-2xl border-black dark:border-white"
>
  {#if project.budget == 0}
    <strong class="flex-1 font-light">Total:</strong>
    <small class="flex-none font-semibold">
      {#if hours}
        {#await hours}
          <span>?</span>
        {:then hours}
          <span>{Math.round(hours)}</span>
        {/await}
      {/if}
      <span class="font-normal opacity-50">hr</span>
    </small>
  {:else}
    <strong class="flex-1 font-light">Remaining:</strong>
    <small class="flex-none font-semibold">
      {#if hours}
        {#await hours}
          <span>?</span>
        {:then hours}
          <span
            class={`${
              Math.round(project.budget - hours) < 8 ? "text-red-500" : ""
            }`}>{Math.round(project.budget - hours)}</span
          >
        {/await}
      {/if}
      <span class="font-normal opacity-50">hr</span>
    </small>
  {/if}
</div>
