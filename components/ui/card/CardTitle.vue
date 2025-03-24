<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<{
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    class?: HTMLAttributes["class"];
  }>(),
  {
    as: "h3",
    class: "",
  },
);
</script>

<template>
  <component
    :is="props.as"
    :class="cn('font-semibold leading-none tracking-tight', props.class)"
  >
    <slot />
  </component>
</template>
