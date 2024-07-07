const { createSession } = require("better-sse");

module.exports = function (fastify, opts, done) {
    
    const sessionStore = {};

    fastify.get('/createSession', async (request, reply) => {

        const requestOrigin = request.raw.headers['origin'];
        const currentDate = new Date();
        const sessionHash = currentDate.getTime().toString(15);

        const sessionConfig = {
          headers: { 'Access-Control-Allow-Origin': requestOrigin, 'Access-Control-Allow-Credentials': true, 'Set-Cookie': `sessionId=${sessionHash}` },
          keepAlive: null
        }
  
        const session = await createSession(request.raw, reply.raw, sessionConfig);
        sessionStore['test'] = session;
    });

    fastify.get('/:sessionId/dynamic', (request, reply) => {

        const { sessionId } = request.params;

        const session = sessionStore['test'];
        session.push('Hello!');
        reply.send('data pushed');
    });
    done();
}