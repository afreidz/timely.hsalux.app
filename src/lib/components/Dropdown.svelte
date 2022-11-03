<script lang="ts">
  import Field from "./Field.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<Field {...$$props}>
  <select
    class="py-2"
    slot="custom"
    value={$$props.val}
    on:change={(e) => dispatch("change", e.currentTarget.value)}
  >
    <slot />
  </select>
  <slot name="lower" slot="lower" />
</Field>
