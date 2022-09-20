<script lang="ts">
  import now from "../stores/now";
  import Heading from "./Heading.svelte";
</script>

<header
  class="p-5 flex justify-between bg-white dark:bg-neutral-900 border-b border-white dark:border-black"
>
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
</header>
