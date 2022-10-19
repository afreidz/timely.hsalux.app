<script lang="ts">
  import { add } from "../../stores/projects";
  import colorKeys from "../../helpers/colors";
  import Field from "../..//components/Field.svelte";
  import Button from "../../components/Button.svelte";
  import Heading from "../../components/Heading.svelte";
  import Checkbox from "../..//components/Checkbox.svelte";
  import { RadioGroup } from "@rgossiaux/svelte-headlessui";

  let newProjectName: string = "";
  let newProjectImgurl: string = "";
  let newProjectColor: string = "blue-500";

  function create() {
    add(newProjectName, newProjectColor, newProjectImgurl);
    window.location.hash = "";
  }
</script>

<svelte:head>
  <title>Add new project</title>
</svelte:head>

<header class="view-heading">
  <Heading as="h4">Add A New Project</Heading>
</header>
<section class="p-6 flex flex-col flex-1">
  <form
    class="mt-6 flex flex-col flex-1"
    on:submit|preventDefault={() => create()}
  >
    <div class="flex-1">
      <Field
        required
        label="Project Name"
        name="newProjectName"
        bind:val={newProjectName}
      />
      <Field readonly label="Project Color">
        <RadioGroup
          slot="readonly"
          name="newProjectColor"
          value={newProjectColor}
          class="flex flex-wrap mt-2"
          on:change={(e) => (newProjectColor = e.detail)}
        >
          {#each colorKeys as color}
            <Checkbox {color} />
          {/each}
        </RadioGroup>
      </Field>
    </div>
    <footer class="flex flex-none justify-end">
      <Button class="sm:text-xl">Create</Button>
    </footer>
  </form>
</section>
