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

<section class="p-6 flex flex-col flex-1">
  <Heading as="h4" variant="section">Add A New Project</Heading>
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
      <Field
        label="Image URL"
        name="newProjectImgurl"
        bind:val={newProjectImgurl}
      />
      <RadioGroup
        name="newProjectColor"
        class="flex flex-wrap"
        value={newProjectColor}
        on:change={(e) => (newProjectColor = e.detail)}
      >
        {#each colorKeys as color}
          <Checkbox {color} />
        {/each}
      </RadioGroup>
    </div>
    <footer class="flex flex-none justify-end">
      <Button>
        <span class="inline-block text-xl p-4">Create</span>
      </Button>
    </footer>
  </form>
</section>
