<script lang="ts">
  import Icon from "@iconify/svelte";
  import subview from "../../stores/subview";
  import colorKeys from "../../helpers/colors";
  import settings from "../../stores/settings";
  import Field from "../..//components/Field.svelte";
  import Switch from "../../components/Switch.svelte";
  import Button from "../../components/Button.svelte";
  import Heading from "../../components/Heading.svelte";
  import Checkbox from "../..//components/Checkbox.svelte";
  import { RadioGroup } from "@rgossiaux/svelte-headlessui";
  import projects, { type Project } from "../../stores/projects";

  export let id: string;
  let project: Project;
  let hours;

  $: project = $projects.find((p) => p.id === id);
  $: if (!project) {
    $subview = null;
    window.location.hash = "";
  }

  $: if (project && $settings.showHours?.includes(project.id)) {
    hours = project.calculateHours();
  }
</script>

<svelte:head>
  <title>Project Details for: {project?.name || ""}</title>
</svelte:head>

{#if !!project}
  <header class="view-heading">
    <Heading as="h4">Project Details</Heading>
  </header>
  <section class="p-6 flex flex-col flex-1">
    <div>
      <Field
        required
        name="projectName"
        label="Project Name"
        bind:val={project.name}
      />
      <Field readonly label="Project Color">
        <RadioGroup
          slot="readonly"
          name="projectColor"
          value={project.color}
          class="flex flex-wrap mt-2"
          on:change={(e) => (project.color = e.detail)}
        >
          {#each colorKeys as color}
            <Checkbox {color} />
          {/each}
        </RadioGroup>
      </Field>
      <Field>
        <Switch
          slot="custom"
          name="showHours"
          enabled={$settings?.showHours.includes(project.id)}
          label="Show Hours/Budgets for this project?"
          class="flex-1 justify-between"
          on:change={(e) => {
            if (e.detail) {
              $settings = {
                ...$settings,
                showHours: [...($settings.showHours || []), project.id],
              };
            } else {
              $settings = {
                ...$settings,
                showHours: ($settings.showHours || []).filter(
                  (p) => p !== project.id
                ),
              };
            }
          }}
        />
      </Field>
    </div>
    {#if $settings.showHours?.includes(project.id)}
      <div class="flex-1 flex flex-col items-center justify-center">
        <strong class="text-2xl font-light mb-4">Project Hours</strong>
        <div class="w-full max-w-xs">
          <Field
            min="0"
            step="1"
            type="number"
            label="Budgeted"
            name="projectBudget"
            bind:val={project.budget}
            class="text-2xl text-center"
          />
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
                      Math.round(project.budget - hours) < 8
                        ? "text-red-500"
                        : ""
                    }`}>{Math.round(project.budget - hours)}</span
                  >
                {/await}
              {/if}
              <span class="font-normal opacity-50">hr</span>
            </small>
          {/if}
        </div>
      </div>
    {/if}
    <div class="flex justify-around items-center gap-10">
      <div class="flex-1">
        <Heading as="h4" variant="section">
          <span>&nbsp;</span>
        </Heading>
        <Field readonly>
          <Button
            on:click={() =>
              project.archived ? project.unarchive() : project.archive()}
            class="bg-blue-500"
            slot="readonly"
          >
            <span class="flex items-center">
              {#if project.archived}
                <Icon icon="heroicons:eye" class="h-4 w-4" />
              {:else}
                <Icon icon="heroicons:eye-slash" class="h-4 w-4" />
              {/if}
              <span class="ml-1"
                >{#if project.archived}Una{:else}A{/if}rchive Project</span
              >
            </span>
          </Button>
          <p slot="lower" class="pb-4 text-xs opacity-30">
            This will remove the project from view but keep the timer
            association for reporting reporting purposes. Use "Delete" if this
            project was a mistake.
          </p>
        </Field>
      </div>
      <div class="flex-1">
        <Heading as="h4" variant="section">
          <span class="text-red-500">Danger Zone</span>
        </Heading>
        <Field readonly>
          <Button
            on:click={() => project.delete()}
            class="bg-red-500"
            slot="readonly"
          >
            <span class="flex items-center">
              <Icon icon="heroicons:trash" class="h-4 w-4" />
              <span class="ml-1">Delete Project</span>
            </span>
          </Button>
          <p slot="lower" class="pb-4 text-xs text-red-500">
            This will create orphaned Timers. If you wish to remove it from the
            project list, use "Archive" instead.
          </p>
        </Field>
      </div>
    </div>
  </section>
{/if}
