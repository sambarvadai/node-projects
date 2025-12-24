import Book from "../models/book.js";
async function booksRouter(fastify, _opts) {
    fastify.get("/:id", async (request, reply) => {
        const { id } = request.params;
        try {
            const book = await Book.findByPk(id);
            reply.send(book);
        } catch (err) {
            console.error(err);
            reply.send(err);
        }
    });
     fastify.post("/", async (request, reply) => {
        const { title, author } = request.body;
        try {
            const book = await Book.create({ title, author });
            reply.send(book);
        } catch (err) {
            console.error(err);
            reply.send(err);
        }
     });
    fastify.put("/:id", async (request, reply) => {
        const { id } = request.params;
        const {title, author} = request.body;
        try {
            const book = await Book.update({ title, author }, {
                where: {id}
            })
            reply.send(book);
        } catch (err) {
            console.error(err);
            reply.send(err);
        }
    });
      fastify.delete("/:id", async (request, reply) => {
        const { id } = request.params;
        try {
            const book = await Book.destroy({
                where: { id }
            });
            reply.send(book);
        } catch (err) {
            console.error(err);
            reply.send(err);
        }
    });
}
export default booksRouter;