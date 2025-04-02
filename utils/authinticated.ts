import type { H3Event } from "h3";

export const isAuthenticated = async (event: H3Event) => {
  const user = await getUserSession(event);
  return !!user;
};
