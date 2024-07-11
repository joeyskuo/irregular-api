const { createSession } = require("better-sse");

module.exports = function (fastify, opts, done) {
    
    const sessionStore = {};

    fastify.get('/session', async (request, reply) => {

        const requestOrigin = request.raw.headers['origin'];
        const requestIp = request.ip;

        const currentDate = new Date();
        const sessionHash = currentDate.getTime().toString(15);

        const sessionConfig = {
          headers: { 'Access-Control-Allow-Origin': requestOrigin, 'Access-Control-Allow-Credentials': true, 'Set-Cookie': `sessionId=${sessionHash}` },
          keepAlive: null
        }
  
        const session = await createSession(request.raw, reply.raw, sessionConfig);
        
        sessionStore[requestIp] = { session: session, 
                                    sessionId: sessionHash,
                                    lastActive: Date.now()
                                };
    });

    fastify.get('/:sessionId/inference', async (request, reply) => {

        const { sessionId } = request.params;
        const requestIp = request.ip;
        const requestOrigin = request.raw.headers['origin'];


        reply.header('Access-Control-Allow-Origin', requestOrigin);

        const sessionData = sessionStore[requestIp];
        const session = sessionData.session;
        sessionData.lastActive = Date.now();
        
        if(sessionId != sessionData.sessionId) {
            session.push('New Session!');
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
            session.push("Hello! How can");
            await new Promise(resolve => setTimeout(resolve, 1000));
            session.push(" I assist you");
            await new Promise(resolve => setTimeout(resolve, 1000));
            session.push("?");
        }

        reply.code(200).send();
    });

    done();
}