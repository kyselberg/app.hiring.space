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
import { useApi } from "~/composables/useApi";
import type {
  CheckboxQuestion,
  Question,
  RadioQuestion,
  SelectQuestion,
} from "~/types/quiz";
import { QuestionType } from "~/types/quiz";

const router = useRouter();
const { fetchWithCsrf } = useApi();

const name = ref("");
const description = ref("");
const questions = ref<Question[]>([]);
const isLoading = ref(false);
const error = ref("");

const addQuestion = () => {
  const newQuestion: RadioQuestion = {
    type: QuestionType.RADIO,
    text: "",
    required: true,
    options: ["", ""],
    correctOption: 0,
  };
  questions.value.push(newQuestion);
};

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1);
};

const addOption = (questionIndex: number) => {
  const question = questions.value[questionIndex];
  if (
    question.type === QuestionType.RADIO ||
    question.type === QuestionType.CHECKBOX ||
    question.type === QuestionType.SELECT
  ) {
    const typedQuestion = question as
      | RadioQuestion
      | CheckboxQuestion
      | SelectQuestion;
    typedQuestion.options.push("");
  }
};

const removeOption = (questionIndex: number, optionIndex: number) => {
  const question = questions.value[questionIndex];
  if (
    question.type === QuestionType.RADIO ||
    question.type === QuestionType.CHECKBOX ||
    question.type === QuestionType.SELECT
  ) {
    const typedQuestion = question as
      | RadioQuestion
      | CheckboxQuestion
      | SelectQuestion;
    typedQuestion.options.splice(optionIndex, 1);
  }
};

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    error.value = "";

    await fetchWithCsrf("/api/quiz/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.value,
        description: description.value,
        questions: questions.value,
      }),
    });

    router.push("/dashboard");
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : "Failed to create quiz";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto py-8">
    <Card>
      <CardHeader>
        <CardTitle>Create Quiz</CardTitle>
        <CardDescription>Create a new quiz with questions</CardDescription>
      </CardHeader>
      <form @submit.prevent="handleSubmit">
        <CardContent>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="name">Quiz Name</Label>
              <Input
                id="name"
                v-model="name"
                type="text"
                placeholder="Enter quiz name"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label for="description">Description</Label>
              <Input
                id="description"
                v-model="description"
                type="text"
                placeholder="Enter quiz description"
                required
              />
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium">Questions</h3>
                <Button type="button" @click="addQuestion">Add Question</Button>
              </div>

              <div
                v-for="(question, questionIndex) in questions"
                :key="questionIndex"
                class="p-4 border rounded-lg space-y-4"
              >
                <div class="flex justify-between items-center">
                  <h4 class="font-medium">Question {{ questionIndex + 1 }}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    @click="removeQuestion(questionIndex)"
                  >
                    Remove
                  </Button>
                </div>

                <div class="grid gap-2">
                  <Label>Question Text</Label>
                  <Input
                    v-model="question.text"
                    type="text"
                    placeholder="Enter question text"
                    required
                  />
                </div>

                <div class="grid gap-2">
                  <Label>Question Type</Label>
                  <select
                    v-model="question.type"
                    class="w-full p-2 border rounded"
                  >
                    <option :value="QuestionType.RADIO">Radio</option>
                    <option :value="QuestionType.CHECKBOX">Checkbox</option>
                    <option :value="QuestionType.SELECT">Select</option>
                    <option :value="QuestionType.SHORT_ANSWER">
                      Short Answer
                    </option>
                    <option :value="QuestionType.LONG_ANSWER">
                      Long Answer
                    </option>
                  </select>
                </div>

                <div
                  v-if="['RADIO', 'CHECKBOX', 'SELECT'].includes(question.type)"
                >
                  <div class="flex justify-between items-center">
                    <Label>Options</Label>
                    <Button type="button" @click="addOption(questionIndex)">
                      Add Option
                    </Button>
                  </div>
                  <div
                    v-for="(option, optionIndex) in (
                      question as
                        | RadioQuestion
                        | CheckboxQuestion
                        | SelectQuestion
                    ).options"
                    :key="optionIndex"
                    class="flex gap-2 mt-2"
                  >
                    <Input
                      v-model="
                        (
                          question as
                            | RadioQuestion
                            | CheckboxQuestion
                            | SelectQuestion
                        ).options[optionIndex]
                      "
                      type="text"
                      placeholder="Enter option"
                      required
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      @click="removeOption(questionIndex, optionIndex)"
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <div
                  v-if="['RADIO', 'SELECT'].includes(question.type)"
                  class="grid gap-2"
                >
                  <Label>Correct Option</Label>
                  <select
                    v-model="
                      (question as RadioQuestion | SelectQuestion).correctOption
                    "
                    class="w-full p-2 border rounded"
                  >
                    <option
                      v-for="(_, index) in (
                        question as RadioQuestion | SelectQuestion
                      ).options"
                      :key="index"
                      :value="index"
                    >
                      Option {{ index + 1 }}
                    </option>
                  </select>
                </div>

                <div
                  v-if="question.type === QuestionType.CHECKBOX"
                  class="grid gap-2"
                >
                  <Label>Correct Options</Label>
                  <div class="space-y-2">
                    <label
                      v-for="(_, index) in (question as CheckboxQuestion)
                        .options"
                      :key="index"
                      class="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        :value="index"
                        v-model="(question as CheckboxQuestion).correctOptions"
                      />
                      Option {{ index + 1 }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="error" class="text-sm text-red-500">
              {{ error }}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" :disabled="isLoading">
            {{ isLoading ? "Creating..." : "Create Quiz" }}
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
