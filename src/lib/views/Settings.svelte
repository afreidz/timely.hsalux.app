<script lang="ts">
  import Icon from "@iconify/svelte";
  import auth from "../stores/auth";
  import theme from "../stores/theme";
  import error from "../stores/error";
  import { signout } from "../helpers/auth";
  import Field from "../components/Field.svelte";
  import { Forecast } from "../stores/forecasts";
  import Button from "../components/Button.svelte";
  import Switch from "../components/Switch.svelte";
  import Heading from "../components/Heading.svelte";
  import { deleteAllTimers } from "../stores/timers";
  import settings, { load } from "../stores/settings";
  import Dropdown from "../components/Dropdown.svelte";
  import { deleteAllProjects } from "../stores/projects";

  let endofday;
  let rounding;
  let startofday;
  $: rounding = $settings?.rounding;
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
    <Dropdown
      val={rounding}
      label="Reporting Rounding"
      on:change={(e) => ($settings = { ...$settings, rounding: e.detail })}
    >
      <option default value="none">None</option>
      <option value="0.25">15m</option>
      <option value="0.5">30m</option>
      <option value="1">1hr</option>
      <p slot="lower" class="pb-4 text-xs opacity-30">
        Time calculations will be rounded to the value set here.
      </p>
    </Dropdown>
    <Heading as="h4" variant="section" class="mt-12">Timers</Heading>
    <Field>
      <Switch
        slot="custom"
        name="autoStop"
        enabled={$settings?.autoStop}
        class="flex-1 justify-between"
        label="Enable Auto Stop Timers"
        on:change={(e) => {
          if (e.detail && !$settings?.endofday) {
            $error = {
              message: `Please set "End of Workday" to enable "Auto Stop"`,
            };
            $settings = { ...$settings, autoStop: false };
            return;
          }
          $settings = { ...$settings, autoStop: e.detail };
        }}
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
    <Field>
      <Switch
        slot="custom"
        name="autoSnapTimers"
        label="Enable Auto Snap timers"
        enabled={$settings?.autoSnap}
        class="flex-1 justify-between"
        on:change={(e) => {
          if (e.detail && !$settings?.startofday) {
            $error = {
              message: `Please set "Start of Workday" to enable "Auto Snap"`,
            };
            $settings = { ...$settings, autoSnap: false };
            return;
          }
          $settings = {
            ...$settings,
            autoSnap: e.detail,
          };
        }}
      />
      <div slot="lower" class="py-4 text-xs opacity-30">
        <p>
          When enabled, new timers will start snapped to the end of the previous
          timer. If there is no previous timer, it will snap to the Start of
          Workday.
        </p>
      </div>
    </Field>
    <Field>
      <Switch
        slot="custom"
        name="multipleRunning"
        class="flex-1 justify-between"
        enabled={$settings?.multipleRunning}
        label="Allow multiple running timers at once"
        on:change={(e) =>
          ($settings = {
            ...$settings,
            multipleRunning: e.detail,
          })}
      />
      <p slot="lower" class="py-4 text-xs opacity-30">
        If this setting is enabled, you can have multiple running timers, if
        disabled, new timers will stop the currently running timer.
      </p>
    </Field>
    <div class="mt-12">
      <Heading as="h4" variant="section">Account Settings</Heading>
      <Field readonly name="account" label="Signed in as" val={$auth.email}>
        <Icon icon="logos:microsoft-icon" slot="icon" class="h-6 w-6 mr-4" />
        <Button
          slot="lower"
          class="py-2 flex-1"
          on:click={() => signout($auth.email)}>Sign Out</Button
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
          <Button on:click={() => Forecast.deleteAll()} class="bg-red-500 py-4"
            >Delete All Forecasts</Button
          >
        </div>
      </Field>
    </div>
  {/await}
</section>
