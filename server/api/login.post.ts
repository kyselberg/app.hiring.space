export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;
  return { email, password };
});
