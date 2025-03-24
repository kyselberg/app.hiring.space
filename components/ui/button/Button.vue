<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Primitive, type PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { type ButtonVariants, buttonVariants } from ".";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: HTMLAttributes["class"];
  type?: HTMLButtonElement["type"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  type: "button",
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :type="props.type"
  >
    <slot />
  </Primitive>
</template>
