import { desc, eq } from "drizzle-orm";
import db from "~/server/db";
import { quizesTable } from "~/server/db/schema/quizes";
import { isAuthenticated } from "~/utils/authinticated";

export default defineEventHandler(async (event) => {
  try {
    if (!(await isAuthenticated(event))) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const user = await getUserSession(event);

    const quizes = await db
      .select()
      .from(quizesTable)
      .where(eq(quizesTable.ownerId, user.id))
      .orderBy(desc(quizesTable.createdAt));

    return quizes;
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }
});
