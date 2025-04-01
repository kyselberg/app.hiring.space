import { genSalt, hash } from "bcryptjs";
import { z } from "zod";
import db from "~/server/db";
import { usersTable } from "~/server/db/schema/users";

const registrationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, registrationSchema.parse);
    const { email, name, password, confirmPassword } = body;

    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (confirmPassword !== password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Passwords do not match",
      });
    }

    const salt = await genSalt(parseInt(process.env.CRYPTO_SALT!, 10));
    const hashedPassword = await hash(password, salt);

    const user = await db
      .insert(usersTable)
      .values({ email, name, password: hashedPassword })
      .returning()
      .then((res) => res[0]);

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request",
    });
  }
});
