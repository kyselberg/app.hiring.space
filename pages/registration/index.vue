<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const router = useRouter();
const route = useRoute();
const email = ref("");
const password = ref("");
const name = ref("");
const isLoading = ref(false);
const error = ref("");

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    error.value = "";

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        name: name.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    const redirectPath = (route.query.redirect as string) || "/dashboard";
    router.push(redirectPath);
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : "Registration failed";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle as="h1" class="text-2xl font-bold">{{
          $t("registration.title")
        }}</CardTitle>
        <CardDescription>
          {{ $t("registration.description.text") }}
          <NuxtLink
            to="/login"
            class="font-medium text-primary hover:text-primary/90"
          >
            {{ $t("registration.description.link") }}
          </NuxtLink>
        </CardDescription>
      </CardHeader>
      <form @submit.prevent="handleSubmit">
        <CardContent>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="name">{{ $t("registration.name.label") }}</Label>
              <Input
                id="name"
                v-model="name"
                type="text"
                :placeholder="$t('registration.name.placeholder')"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label for="email">{{ $t("registration.email.label") }}</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                :placeholder="$t('registration.email.placeholder')"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label for="password">{{
                $t("registration.password.label")
              }}</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                :placeholder="$t('registration.password.placeholder')"
                required
              />
            </div>
            <div v-if="error" class="text-sm text-red-500">
              {{ error }}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" class="w-full" :disabled="isLoading">
            <template v-if="isLoading">
              <svg
                class="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>{{ $t("registration.button.loading") }}</span>
            </template>
            <span v-else>{{ $t("registration.button.default") }}</span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
