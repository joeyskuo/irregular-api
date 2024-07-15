const { createSession } = require("better-sse");

module.exports = function (fastify, opts, done) {
    
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
        
        fastify.sessionStore[requestIp] = { session: session, 
                                    sessionId: sessionHash,
                                    lastActive: Date.now()
                                };

        const storedSessionData = await fastify.redis.get(requestIp);

        if(storedSessionData) {
            
            const sessionData = JSON.parse(storedSessionData);
            sessionData.messages = [];
            await fastify.redis.set(requestIp, JSON.stringify(sessionData));
        }
    });

    fastify.get('/:sessionId/inference', async (request, reply) => {

        const { sessionId } = request.params;
        const requestIp = request.ip;
        const requestOrigin = request.raw.headers['origin'];


        reply.header('Access-Control-Allow-Origin', requestOrigin);

        const sessionData = fastify.sessionStore[requestIp];
        const session = sessionData.session;

        const currentTime = Date.now();
        sessionData.lastActive = currentTime;

        const MESSAGE_EVENT = 'message';
        const messageId = currentTime.toString(30);
        
        if(sessionId != sessionData.sessionId) {
            session.push('New Session!', MESSAGE_EVENT, messageId);
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
            session.push("Hello! How can", MESSAGE_EVENT, messageId);
            await new Promise(resolve => setTimeout(resolve, 1000));
            session.push(" I assist you", MESSAGE_EVENT, messageId);
            await new Promise(resolve => setTimeout(resolve, 1000));
            session.push("?", MESSAGE_EVENT, messageId);
        }

        reply.code(200).send();
    });

    done();
}