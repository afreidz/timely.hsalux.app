<script lang="ts">
  import { add } from"../../stores/projects";
  import Field from "../..//components/Field.svelte";
  import Button from "../../components/Button.svelte";
  import Heading from "../../components/Heading.svelte";
  import Checkbox from "../..//components/Checkbox.svelte";
  import { RadioGroup } from "@rgossiaux/svelte-headlessui";

  let newProjectName: string = "";
  let newProjectImgurl: string = "";
  let newProjectColor: string = "blue-500";

  const colorKeys = [
    "red",
    "sky",
    "rose",
    "gray",
    "lime",
    "teal",
    "blue",
    "cyan",
    "pink",
    "slate",
    "stone",
    "amber",
    "green",
    "orange",
    "yellow",
    "indigo",
    "violet",
    "purple",
    "emerald",
    "fuchsia",
  ];

  function create() {
    add(newProjectName, newProjectColor, newProjectImgurl);
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
        name="newProjectImgurl"
        label="Image URL"
        bind:val={newProjectImgurl}
      />
      <Field name="newProjectColor" label="Color">
        <RadioGroup
          class="flex flex-wrap"
          value={newProjectColor}
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
