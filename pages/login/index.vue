<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n, ref, useRouter } from "#imports";

const { t } = useI18n();
const router = useRouter();

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    await $fetch("/api/auth/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });

    router.push("/");
  } catch (error) {
    errorMessage.value = error.statusMessage || t("login.errors.failed");
    console.error("Login error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">{{ t("login.title") }}</CardTitle>
        <CardDescription>
          {{ t("login.description") }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="handleLogin">
          <div v-if="errorMessage" class="text-sm text-red-500 mb-2">
            {{ errorMessage }}
          </div>
          <div class="grid gap-2">
            <Label for="email">{{ t("login.email.label") }}</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              :placeholder="t('login.email.placeholder')"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">{{ t("login.password.label") }}</Label>
            </div>
            <Input
              id="password"
              v-model="password"
              type="password"
              :placeholder="t('login.password.placeholder')"
              required
            />
          </div>
          <Button type="submit" class="w-full" :disabled="isLoading">
            <IconLoader2 v-if="isLoading" class="w-4 h-4 mr-2" />
            {{
              isLoading ? t("login.button.loading") : t("login.button.default")
            }}
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          {{ t("login.noAccount") }}
          <NuxtLinkLocale to="/registration" class="underline">
            {{ t("login.signupLink") }}
          </NuxtLinkLocale>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
