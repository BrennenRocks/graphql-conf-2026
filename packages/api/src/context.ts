import type { Context as HonoContext } from "hono";

export interface CreateContextOptions {
	context: HonoContext;
}

export function createContext({ context }: CreateContextOptions) {
	return {
		request: context.req.raw,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
