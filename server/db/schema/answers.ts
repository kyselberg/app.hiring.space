import {
  integer,
  jsonb,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { quizesTable } from "./quizes";

export const answersTable = pgTable("answers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  candidateId: varchar({ length: 255 }).notNull(),
  quizId: integer().references(() => quizesTable.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  answers: jsonb().array(),
});
