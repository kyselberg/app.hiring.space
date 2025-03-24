<script setup lang="ts">
const { locale } = useI18n();

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
});
</script>

<template>
  <div>
    <slot />
  </div>
</template>
