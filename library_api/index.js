import fastify from "fastify";
import fastifyFormbody from "@fastify/formbody";
import routes from "./routes/index.js";
const app = fastify();
await app.register(fastifyFormbody);
const PORT = 3000;
app.get("/", async (_request, reply) => {
    reply.send({ message: "OK" });
});
await app.register(routes, { prefix: "/api" });
app.setNotFoundHandler((request, reply) => {
    const { message, statusCode } = request.error || {};
    reply.status(statusCode || 500).send({ message });
});// This is a universal handler for all requests for which there is no handler defined.
try {
    await app.listen({ port: PORT });
    console.log ("Listening on port", PORT);
} catch (err) {
   console.error(err);
    process.exit(1);
}