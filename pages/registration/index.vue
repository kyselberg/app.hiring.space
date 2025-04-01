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

    // Here you would typically call your registration API
    // For example:
    // await $fetch('/api/auth/register', {
    //   method: 'POST',
    //   body: { name: name.value, email: email.value, password: password.value }
    // });

    // Mock success for now
    console.log("Registration attempted with:", {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    // Redirect to login page or dashboard after successful registration
    router.push("/login");
  } catch (error) {
    errorMessage.value = t("registration.errors.failed");
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
        <form @submit.prevent="handleRegistration" class="grid gap-4">
          <div v-if="errorMessage" class="text-sm text-red-500 mb-2">
            {{ errorMessage }}
          </div>
          <div class="grid gap-2">
            <Label for="name">{{ t("registration.name.label") }}</Label>
            <Input
              id="name"
              type="text"
              v-model="name"
              :placeholder="t('registration.name.placeholder')"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="email">{{ t("login.email.label") }}</Label>
            <Input
              id="email"
              type="email"
              v-model="email"
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
              type="password"
              v-model="password"
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
              type="password"
              v-model="confirmPassword"
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
