<script lang="ts">
  import auth from "../stores/auth";
  import Icon from "@iconify/svelte";
  import { settings } from "../stores/settings";
  import Field from "../components/Field.svelte";
  import Button from "../components/Button.svelte";
  import Switch from "../components/Switch.svelte";
  import Heading from "../components/Heading.svelte";
  import { deleteAllTimers } from "../stores/timers";
  import { signout } from "../helpers/firebase/auth";
  import { deleteAllProjects } from "../stores/projects";

  let endofday;
  $: endofday = $settings?.endofday ?? null;
</script>

<section class="p-6">
  <Heading as="h4" variant="section">Application Settings</Heading>
  <Field readonly>
    <Switch
      slot="switch"
      name="autoStop"
      enabled={$settings?.autoStop}
      class="flex-1 justify-between"
      label="Enable Auto Stop of Timers"
      on:change={(e) => ($settings = { ...$settings, autoStop: e.detail })}
    />
    <p slot="lower" class="py-4 text-xs opacity-30">
      When enabled, any running timers will automatically stop when they meet
      the time set in "End of Workday."
    </p>
  </Field>
  <Field
    type="time"
    name="endofday"
    bind:value={endofday}
    label="End of Workday"
    on:change={(e) => ($settings = { ...$settings, endofday: e.detail })}
  >
    <Icon slot="icon" icon="heroicons:clock" class="h-6 w-6 opacity-50 mr-2" />
  </Field>
  <div class="mt-12">
    <Heading as="h4" variant="section">Account Settings</Heading>
    <Field readonly name="account" label="Signed in as" val={$auth.email}>
      <Icon icon="logos:microsoft-icon" slot="icon" class="h-6 w-6 mr-4" />
      <Button slot="sub" class="py-2" on:click={() => signout()}
        >Sign Out</Button
      >
    </Field>
  </div>
  <div class="mt-12">
    <Heading as="h4" variant="section">
      <span class="text-red-500">Danger Zone</span>
    </Heading>
    <Field readonly>
      <div slot="readonly" class="flex justify-around">
        <Button on:click={() => deleteAllProjects()} class="bg-red-500 py-4"
          >Delete All Projects</Button
        >
        <Button on:click={() => deleteAllTimers()} class="bg-red-500 py-4"
          >Delete All Timers</Button
        >
      </div>
    </Field>
  </div>
</section>
