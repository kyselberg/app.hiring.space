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

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

const handleRegistration = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    if (password.value !== confirmPassword.value) {
      errorMessage.value = t("registration.errors.passwordMismatch");
      return;
    }

    await $fetch("/api/auth/registration", {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      },
    });

    router.push("/");
  } catch (error) {
    errorMessage.value = error.statusMessage || t("registration.errors.failed");
    console.error("Registration error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <Card
      class="rounded-xl w-full border bg-card text-card-foreground shadow mx-auto max-w-sm"
    >
      <CardHeader>
        <CardTitle class="text-2xl">{{ t("registration.title") }}</CardTitle>
        <CardDescription>
          {{ t("registration.description") }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="handleRegistration">
          <div v-if="errorMessage" class="text-sm text-red-500 mb-2">
            {{ errorMessage }}
          </div>
          <div class="grid gap-2">
            <Label for="name">{{ t("registration.name.label") }}</Label>
            <Input
              id="name"
              v-model="name"
              type="text"
              :placeholder="t('registration.name.placeholder')"
              required
            />
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
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="confirmPassword">{{
                t("registration.confirmPassword.label")
              }}</Label>
            </div>
            <Input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              :placeholder="t('registration.confirmPassword.placeholder')"
              required
            />
          </div>
          <Button type="submit" class="w-full" :disabled="isLoading">
            <IconLoader2 v-if="isLoading" class="w-4 h-4 mr-2" />
            {{
              isLoading
                ? t("registration.button.loading")
                : t("registration.button.default")
            }}
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          {{ t("registration.haveAccount") }}
          <NuxtLinkLocale to="/login" class="underline">
            {{ t("registration.loginLink") }}
          </NuxtLinkLocale>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
