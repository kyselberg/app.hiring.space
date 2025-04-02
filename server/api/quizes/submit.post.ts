import { eq } from "drizzle-orm";
import { z } from "zod";
import db from "../../db";
import { answersTable } from "../../db/schema/answers";
import { quizesTable } from "../../db/schema/quizes";

interface Question {
  text: string;
  options: string[];
  correctOption: number;
}

const answerSchema = z.object({
  questionIndex: z.number().min(0, "Question index must be non-negative"),
  selectedOption: z
    .number()
    .min(0, "Selected option index must be non-negative"),
});

const submitAnswerSchema = z.object({
  candidateId: z.string().min(1, "Candidate ID is required"),
  quizId: z.number().min(1, "Quiz ID is required"),
  answers: z.array(answerSchema).min(1, "At least one answer is required"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = submitAnswerSchema.parse(body);

    const [quiz] = await db
      .select()
      .from(quizesTable)
      .where(eq(quizesTable.id, validatedData.quizId));

    if (!quiz) {
      throw createError({
        statusCode: 404,
        message: "Quiz not found",
      });
    }

    if (
      !quiz.questions ||
      !Array.isArray(quiz.questions) ||
      quiz.questions.length === 0
    ) {
      throw createError({
        statusCode: 400,
        message: "Quiz has no questions",
      });
    }

    const maxQuestionIndex = quiz.questions.length - 1;
    for (const answer of validatedData.answers) {
      if (answer.questionIndex > maxQuestionIndex) {
        throw createError({
          statusCode: 400,
          message: `Invalid question index: ${answer.questionIndex}`,
        });
      }

      const question = quiz.questions[answer.questionIndex] as Question;
      if (answer.selectedOption >= question.options.length) {
        throw createError({
          statusCode: 400,
          message: `Invalid option index for question ${answer.questionIndex}`,
        });
      }
    }

    const [submission] = await db
      .insert(answersTable)
      .values({
        candidateId: validatedData.candidateId,
        quizId: validatedData.quizId,
        answers: validatedData.answers,
      })
      .returning();

    return {
      success: true,
      data: submission,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: "Validation failed",
        data: error.errors,
      });
    }

    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Failed to submit answers",
    });
  }
});
