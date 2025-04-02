<script setup lang="ts">
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

const { data: quizes, pending } = await useFetch<Quiz[]>("/api/quizes");
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">My Quizzes</h2>
      <Button as="a" href="/quiz/create">Create Quiz</Button>
    </div>

    <div v-if="pending" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="!quizes || quizes.length === 0" class="text-center py-8">
      <p class="text-muted-foreground">
        No quizzes found. Create your first quiz!
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card v-for="quiz in quizes" :key="quiz.id" class="overflow-hidden">
        <CardHeader>
          <CardTitle>{{ quiz.name }}</CardTitle>
          <CardDescription>{{ quiz.description }}</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            {{ quiz.questions?.length || 0 }} questions
          </p>
        </CardContent>
        <CardFooter class="flex justify-between">
          <Button variant="outline" size="sm" as="a" :href="`/quiz/${quiz.id}`">
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            as="a"
            :href="`/quiz/${quiz.id}/edit`"
          >
            Edit
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
