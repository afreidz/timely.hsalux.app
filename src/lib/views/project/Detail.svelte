<script lang="ts">
  import colorKeys from "../../helpers/colors";
  import Field from "../..//components/Field.svelte";
  import Heading from "../../components/Heading.svelte";
  import Checkbox from "../..//components/Checkbox.svelte";
  import { RadioGroup } from "@rgossiaux/svelte-headlessui";
  import projects, { type Project } from "../../stores/projects";

  export let id: string;
  let project: Project;

  $: project = $projects.find((p) => p.id === id);
  $: if (!project) window.location.hash = "";
</script>

<section class="p-6 flex flex-col flex-1">
  <Heading as="h4" variant="section">Project Details</Heading>
  <div class="flex-1">
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
  </div>
</section>
