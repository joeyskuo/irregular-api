module.exports = function (fastify, opts, done) {
    
    fastify.get('/', (request, reply) => {
        reply.send({ hello: 'world' })
    });
    done();
}