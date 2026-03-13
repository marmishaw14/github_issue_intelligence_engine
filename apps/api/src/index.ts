import Fastify from "fastify";
import { registerSearchRoutes } from "./routes/search";

const app = Fastify({ logger: true });

app.get("/ping", async () => {
    return "pong\n";
});

registerSearchRoutes(app);

async function start() {
    const address = await app.listen({ port: 8080 });
    app.log.info(`server is running on ${address}`);
}

start().catch((err) => {
    app.log.error(err);
    process.exit(1);
});
