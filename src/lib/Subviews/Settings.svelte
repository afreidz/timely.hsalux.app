<script lang="ts">
  import Icon from "@iconify/svelte";
  import { settings } from "../stores/settings";
  import Field from "../components/Field.svelte";
  import Switch from "../components/Switch.svelte";
  import Heading from "../components/Heading.svelte";

  let autoStop;
  let endofday;

  $: autoStop = $settings?.autoStop ?? false;
  $: endofday = $settings?.endofday ?? null;
</script>

<section class="p-6">
  <Heading as="h4" variant="section">Settings</Heading>
  <Field readonly>
    <Switch
      slot="switch"
      name="autoStop"
      enabled={autoStop}
      class="flex-1 justify-between"
      label="Enable Auto Stop of Timers"
      on:change={(e) => ($settings = { ...$settings, autoStop: e.detail })}
    />
  </Field>
  <Field
    name="test"
    type="time"
    bind:value={endofday}
    label="End of Workday"
    on:change={(e) => ($settings = { ...$settings, endofday: e.detail })}
  >
    <Icon slot="icon" icon="heroicons:clock" class="h-6 w-6 opacity-50 mr-2" />
  </Field>
</section>
