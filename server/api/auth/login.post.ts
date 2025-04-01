import { usersTable } from "@/server/db/schema/users";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import db from "~/server/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, loginSchema.parse);
    const { email, password } = body;

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .then((res) => res[0]);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
      });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
      });
    }

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }
});
