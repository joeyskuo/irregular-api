module.exports = function (fastify, opts, done) {
    
    fastify.get('/:sessionId/dynamic', (request, reply) => {

        const { sessionId } = request.params;
        
        console.log(sessionId);
        reply.send(sessionId);
    });
    done();
}