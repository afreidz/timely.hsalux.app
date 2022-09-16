<script lang="ts">
  import now from "../stores/now";
  import Button from "./Button.svelte";
  import Heading from "./Heading.svelte";
  import { add } from "../stores/timers";
</script>

<header class="p-5 flex justify-between bg-white">
  <div>
    <small class="text-neutral-400">
      {$now.toLocaleDateString("en", {
        month: "long",
        year: "numeric",
      })}
    </small>

    <Heading>
      {$now.toLocaleString("en", { weekday: "long", day: "numeric" })}
    </Heading>
  </div>
  <Button on:click={() => add()}>New Timer</Button>
</header>
