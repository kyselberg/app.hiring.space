import { z } from "zod";
import { QuestionType } from "~/types/quiz";
import db from "../../db";
import { quizesTable } from "../../db/schema/quizes";

const questionSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal(QuestionType.LONG_ANSWER),
      text: z.string().min(1, "Question text is required"),
      required: z.boolean().optional(),
      placeholder: z.string().optional(),
      maxLength: z.number().positive().optional(),
    }),
    z.object({
      type: z.literal(QuestionType.SHORT_ANSWER),
      text: z.string().min(1, "Question text is required"),
      required: z.boolean().optional(),
      placeholder: z.string().optional(),
      maxLength: z.number().positive().optional(),
      pattern: z.string().optional(),
    }),
    z.object({
      type: z.literal(QuestionType.RADIO),
      text: z.string().min(1, "Question text is required"),
      required: z.boolean().optional(),
      options: z.array(z.string()).min(2, "At least 2 options are required"),
      correctOption: z
        .number()
        .min(0, "Correct option index must be non-negative"),
    }),
    z.object({
      type: z.literal(QuestionType.CHECKBOX),
      text: z.string().min(1, "Question text is required"),
      required: z.boolean().optional(),
      options: z.array(z.string()).min(2, "At least 2 options are required"),
      correctOptions: z.array(
        z.number().min(0, "Option indices must be non-negative"),
      ),
    }),
    z.object({
      type: z.literal(QuestionType.SELECT),
      text: z.string().min(1, "Question text is required"),
      required: z.boolean().optional(),
      options: z.array(z.string()).min(2, "At least 2 options are required"),
      correctOption: z
        .number()
        .min(0, "Correct option index must be non-negative"),
    }),
  ])
  .superRefine((data, ctx) => {
    if (
      data.type === QuestionType.RADIO &&
      data.correctOption >= data.options.length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Correct option index must be less than the number of options",
        path: ["correctOption"],
      });
    }
    if (
      data.type === QuestionType.CHECKBOX &&
      data.correctOptions.some((opt) => opt >= data.options.length)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "All correct option indices must be less than the number of options",
        path: ["correctOptions"],
      });
    }
    if (
      data.type === QuestionType.SELECT &&
      data.correctOption >= data.options.length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Correct option index must be less than the number of options",
        path: ["correctOption"],
      });
    }
  });

const createQuizSchema = z.object({
  name: z
    .string()
    .min(1, "Quiz name is required")
    .max(255, "Quiz name is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(512, "Description is too long"),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = createQuizSchema.parse(body);

    const [quiz] = await db
      .insert(quizesTable)
      .values({
        name: validatedData.name,
        description: validatedData.description,
        questions: validatedData.questions,
      })
      .returning();

    return {
      success: true,
      data: quiz,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: "Validation failed",
        data: error.errors,
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to create quiz",
    });
  }
});
