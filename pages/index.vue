<script setup lang="ts">
import { Button } from "@/components/ui/button";

definePageMeta({
  middleware: ["authenticated"],
});

const { user } = useUserSession();
</script>

<template>
  <div>
    <h1>{{ $t("hi") }}</h1>
    <p>{{ user?.name }}</p>
  </div>
  <Button>Click me</Button>
</template>
