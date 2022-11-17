<script lang="ts">
  import Heading from "./Heading.svelte";
  import { viewDate } from "../stores/timers";
</script>

<header
  class={`
    p-5
    flex
    bg-white
    border-b
    border-white
    justify-between
    dark:border-black
    dark:bg-neutral-900
  `}
>
  <div class="flex-1 shrink">
    <small class="text-neutral-400">
      {$viewDate?.toLocaleDateString("en", {
        month: "long",
        year: "numeric",
      })}
    </small>

    <Heading>
      <span class="flex-none">
        {$viewDate?.toLocaleString("en", { weekday: "long", day: "numeric" })}
      </span>
    </Heading>
  </div>
</header>
