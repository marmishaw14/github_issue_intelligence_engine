import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get('/ping', async (request, reply) => {
    return 'pong\n'
});

app.listen({ port: 8080 }, (err, address) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    app.log.info(`server is running on ${address}`)
});