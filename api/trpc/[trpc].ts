import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";

const emptyContext = () =>
  ({
    user: null,
    req: { headers: {}, cookies: {} },
    res: {
      cookie() {
        return this;
      },
      clearCookie() {
        return this;
      },
    },
  } as const);

export default async function handler(request: Request): Promise<Response> {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async () => emptyContext(),
  });
}
