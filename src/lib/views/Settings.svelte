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
  let startofday;
  $: endofday = $settings?.endofday ?? null;
  $: startofday = $settings?.startofday ?? null;
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<header class="view-heading">
  <Heading as="h4">Application Settings</Heading>
</header>
<section class="p-6">
  {#await load()}
    <Icon icon="eos-icons:loading" class="w-6 h-6" />
  {:then}
    <Heading as="h4" variant="section">General</Heading>
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
      val={startofday}
      name="startofday"
      label="Start of Workday"
      on:change={(e) => ($settings = { ...$settings, startofday: e.detail })}
    >
      <Icon
        slot="icon"
        icon="heroicons:clock"
        class="h-6 w-6 opacity-50 mr-2"
      />
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
    <Field>
      <Switch
        slot="custom"
        name="multipleRunning"
        class="flex-1 justify-between"
        label="Allow multiple running timers at once"
        enabled={!$settings?.gapless && $settings?.multipleRunning}
        on:change={(e) =>
          ($settings = {
            ...$settings,
            multipleRunning: e.detail,
            gapless: $settings.gapless === true ? false : $settings.gapless,
          })}
      />
      <div slot="lower" class="py-4 text-xs opacity-30">
        <p class="mb-4">
          When enabled, you may have multiple running timers at once. If this
          option is enabled, gapless timers cannot be. It will be ambiguous as
          to which timer(s) should be adjusted when the surrounding timers
          change.
        </p>
        <p>
          <strong>Note:</strong> If this setting is disabled, new timers will automatically
          stop the previous running timer!
        </p>
      </div>
    </Field>
    <Field>
      <Switch
        slot="custom"
        name="gaplessTimers"
        label="Gapless timers"
        class="flex-1 justify-between"
        enabled={!$settings?.multipleRunning && $settings?.gapless}
        on:change={(e) =>
          ($settings = {
            ...$settings,
            gapless: e.detail,
            multipleRunning:
              $settings.multipleRunning === true
                ? false
                : $settings.multipleRunning,
          })}
      />
      <div slot="lower" class="py-4 text-xs opacity-30">
        <p>
          When enabled, new timers will start snapped to the end of the previous
          timer. If the start/end times are adjusted, the surrounding timers
          will also auto-adjust to provide a gapless timeline.
        </p>
      </div>
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
