import {
	ApolloServer,
	HeaderMap,
	type HTTPGraphQLResponse,
} from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import {
	createContext,
	type Context as GraphQLContext,
} from "@graphql-conf/api/context";
import { resolvers, typeDefs } from "@graphql-conf/api/schema";
import { auth } from "@graphql-conf/auth";
import { env } from "@graphql-conf/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";

const GRAPHQL_ALLOWED_HEADERS = [
	"Apollo-Require-Preflight",
	"Authorization",
	"Content-Type",
	"X-Apollo-Operation-Name",
];

const app = new Hono();

const apolloServer = new ApolloServer<GraphQLContext>({
	plugins:
		env.NODE_ENV === "production"
			? []
			: [
					ApolloServerPluginLandingPageLocalDefault({
						footer: false,
					}),
				],
	resolvers,
	typeDefs,
});

await apolloServer.start();

const createHeaderMap = (requestHeaders: Headers) => {
	const headers = new HeaderMap();

	requestHeaders.forEach((value, key) => {
		headers.set(key, value);
	});

	return headers;
};

const createRequestBody = async (request: {
	method: string;
	text(): Promise<string>;
}) => {
	if (request.method.toUpperCase() !== "POST") {
		return undefined;
	}

	const rawBody = await request.text();

	if (!rawBody.trim()) {
		return undefined;
	}

	try {
		return JSON.parse(rawBody);
	} catch {
		throw new HTTPException(400, {
			message: "Invalid JSON body",
		});
	}
};

const createGraphQLResponse = (response: HTTPGraphQLResponse) => {
	const headers = new Headers();
	const { body } = response;

	for (const [key, value] of response.headers) {
		headers.set(key, value);
	}

	const status = response.status ?? 200;

	if (body.kind === "complete") {
		return new Response(body.string, {
			headers,
			status,
		});
	}

	const encoder = new TextEncoder();

	const stream = new ReadableStream<Uint8Array>({
		async start(controller) {
			try {
				for await (const chunk of body.asyncIterator) {
					controller.enqueue(encoder.encode(chunk));
				}

				controller.close();
			} catch (error) {
				controller.error(error);
			}
		},
	});

	return new Response(stream, {
		headers,
		status,
	});
};

app.use(logger());
app.use(
	"/*",
	cors({
		allowHeaders: GRAPHQL_ALLOWED_HEADERS,
		allowMethods: ["GET", "POST", "OPTIONS"],
		credentials: true,
		origin: env.CORS_ORIGIN,
	})
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.all("/graphql", async (c) => {
	const httpGraphQLResponse = await apolloServer.executeHTTPGraphQLRequest({
		context: async () => {
			return await createContext({ context: c });
		},
		httpGraphQLRequest: {
			body: await createRequestBody(c.req.raw.clone()),
			headers: createHeaderMap(c.req.raw.headers),
			method: c.req.method,
			search: new URL(c.req.url).search,
		},
	});

	return createGraphQLResponse(httpGraphQLResponse);
});

app.get("/", (c) => {
	return c.text("OK");
});

export default app;
