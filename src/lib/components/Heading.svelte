<script lang="ts">
  import cl from "../helpers/classlist";

  type Variant = "application" | "page" | "section";
  interface IHeadingProps {
    as?: string;
    variant?: string;
  }

  let as: string = "h3";
  let classlist: string;
  let props: IHeadingProps;
  let variant: Variant = "page";

  $: {
    if (variant === "page") {
      classlist = cl`text-xl sm:text-4xl leading-relaxed`;
    } else if (variant === "section") {
      classlist = cl`text-md sm:text-xl leading-relaxed font-light`;
    } else {
      classlist = cl`text-xl sm:text-6xl leading-relaxed`;
    }
    props = { ...$$props };
    delete props.as;
    delete props.variant;
  }

  export { as, variant };
</script>

<svelte:element
  this={as}
  {...props}
  class={`flex items-center ${classlist} ${$$props.class}`}
>
  <slot />
</svelte:element>
