<script lang="ts">
  import Icon from "@iconify/svelte";
  import auth from "../stores/auth";
  import theme from "../stores/theme";
  import Field from "../components/Field.svelte";
  import Button from "../components/Button.svelte";
  import Switch from "../components/Switch.svelte";
  import Heading from "../components/Heading.svelte";
  import { deleteAllTimers } from "../stores/timers";
  import { signout } from "../helpers/firebase/auth";
  import settings, { load } from "../stores/settings";
  import { deleteAllProjects } from "../stores/projects";

  let endofday;
  $: endofday = $settings?.endofday ?? null;
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<section class="p-6">
  <Heading as="h4" variant="section">Application Settings</Heading>
  {#await load()}
    <Icon icon="eos-icons:loading" class="w-6 h-6" />
  {:then}
    <Field>
      <Switch
        name="theme"
        slot="custom"
        enabled={$theme !== "dark"}
        label="Turn the Lights On?"
        class="flex-1 justify-between"
        on:change={(e) =>
          ($settings = {
            ...$settings,
            theme: $theme === "dark" ? "light" : "dark",
          })}
      />
    </Field>
    <Field>
      <Switch
        slot="custom"
        name="autoStop"
        enabled={$settings?.autoStop}
        class="flex-1 justify-between"
        label="Enable Auto Stop of Timers"
        on:change={(e) => ($settings = { ...$settings, autoStop: e.detail })}
      />
      <div slot="lower" class="py-4 text-xs opacity-30">
        <p>
          When enabled, any running timers will automatically stop when they
          meet the time set in "End of Workday."
        </p>
        <p>
          <strong>Note:</strong> all timers will automatically stop at midnight of
          the day they started regardless of this setting.
        </p>
      </div>
    </Field>
    <Field
      type="time"
      val={endofday}
      name="endofday"
      label="End of Workday"
      on:change={(e) => ($settings = { ...$settings, endofday: e.detail })}
    >
      <Icon
        slot="icon"
        icon="heroicons:clock"
        class="h-6 w-6 opacity-50 mr-2"
      />
    </Field>
    <div class="mt-12">
      <Heading as="h4" variant="section">Account Settings</Heading>
      <Field readonly name="account" label="Signed in as" val={$auth.email}>
        <Icon icon="logos:microsoft-icon" slot="icon" class="h-6 w-6 mr-4" />
        <Button slot="lower" class="py-2 flex-1" on:click={() => signout()}
          >Sign Out</Button
        >
      </Field>
    </div>
    <div class="mt-12">
      <Heading as="h4" variant="section">
        <span class="text-red-500">Danger Zone</span>
      </Heading>
      <Field readonly>
        <div slot="readonly" class="flex justify-around flex-wrap">
          <Button on:click={() => deleteAllTimers()} class="bg-red-500 py-4"
            >Delete All Timers</Button
          >
          <Button on:click={() => deleteAllProjects()} class="bg-red-500 py-4"
            >Delete All Projects</Button
          >
        </div>
      </Field>
    </div>
  {/await}
</section>
