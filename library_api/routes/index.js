import booksRouter from "./booksRouter.js";
async function routes(fastify, options) {
    fastify.register(booksRouter, { prefix: "/books" });
}
export default routes;