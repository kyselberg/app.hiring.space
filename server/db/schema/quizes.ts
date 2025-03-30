import {
  integer,
  jsonb,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const quizesTable = pgTable("quizes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  ownerId: integer()
    .references(() => usersTable.id)
    .notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 512 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  questions: jsonb().array(),
});
