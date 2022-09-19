<script lang="ts">
  import colorKeys from "../../helpers/colors";
  import Field from "../../components/Field.svelte";
  import Button from "../../components/Button.svelte";
  import Heading from "../../components/Heading.svelte";
  import Checkbox from "../..//components/Checkbox.svelte";
  import { RadioGroup } from "@rgossiaux/svelte-headlessui";
  import { projects, type Project } from "../../stores/projects";

  export let id: string;

  let project: Project;
  let newProjectColor: string;

  $: project = $projects.find(p => p.id === id);

  function update() {
    console.log({...project, color: newProjectColor });
  }
</script>

<section class="p-6 flex flex-col flex-1">
  <Heading as="h4" variant="section">Add A New Project</Heading>
  <form
    class="mt-6 flex flex-col flex-1"
    on:submit|preventDefault={() => update()}
  >
    <div class="flex-1">
      <Field
        required
        name="projectName"
        label="Project Name"
        bind:val={project.name}
      />
      <Field
        label="Image URL"
        name="newProjectImgurl"
        bind:val={project.image}
      />
      <Field name="newProjectColor" label="Color">
        <RadioGroup
          class="flex flex-wrap"
          value={project.color}
          on:change={(e) => (newProjectColor = e.detail)}
        >
          {#each colorKeys as color}
            <Checkbox {color} />
          {/each}
        </RadioGroup>
      </Field>
    </div>
    <footer class="flex flex-none justify-end">
      <Button>
        <span class="inline-block text-xl p-4">Create</span>
      </Button>
    </footer>
  </form>
</section>
