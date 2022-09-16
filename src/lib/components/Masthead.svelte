<script lang="ts">
  import now from "../stores/now";
  import Button from "./Button.svelte";
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

    <h3 class="text-4xl leading-relaxed">
      {$now.toLocaleString("en", { weekday: "long", day: "numeric" })}
    </h3>
  </div>
  <Button on:click={() => add()}>New Timer</Button>
</header>
