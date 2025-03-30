export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, name, password } = body;
  return { email, name, password };
});
