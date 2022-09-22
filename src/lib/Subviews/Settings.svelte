<script lang="ts">
  import Icon from "@iconify/svelte";
  import { settings } from "../stores/settings";
  import Field from "../components/Field.svelte";
  import Switch from "../components/Switch.svelte";
  import Heading from "../components/Heading.svelte";

  let autoStop;

  $: autoStop = $settings?.autoStop ?? false;
</script>

<section class="p-6">
  <Heading as="h4" variant="section">Settings</Heading>
  <Switch
    name="autoStop"
    enabled={autoStop}
    label="Enable Auto Stop of Timers"
    on:change={(e) => ($settings = { ...$settings, autoStop: e.detail })}
  />
  <Field name="test" label="Auto Stop Time" type="time">
    <Icon slot="icon" icon="heroicons:clock" class="h-6 w-6 opacity-50" />
  </Field>
</section>
