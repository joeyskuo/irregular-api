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

    fastify.post('/:sessionId/inference', async (request, reply) => {

        const { sessionId } = request.params;
        const requestIp = request.ip;

        const modelConfig = {
            model: "claude-3-haiku-20240307",
            max_tokens: 500,
            temperature: 0.7
        }

        const sessionData = fastify.sessionStore[requestIp];
        const session = sessionData.session;

        const currentTime = Date.now();
        sessionData.lastActive = currentTime;

        const MESSAGE_EVENT = 'message';
        const messageId = currentTime.toString(30);
        
        const prompt = request.body.content;
        const newMessage = {role: "user", content: prompt};
  
        const storedInferenceData = await fastify.redis.get(sessionId);
        const inferenceData = JSON.parse(storedInferenceData) ?? {messages: [], usage: {input_tokens: 0, output_tokens: 0}};
  
        inferenceData.messages.push(newMessage);

        const messageStream = fastify.anthropic.messages.stream({
            ...modelConfig,
            messages: inferenceData.messages
        }).on('text', (text) => {
            session.push(text, MESSAGE_EVENT, messageId);
        });

        const inferenceResponse = await messageStream.finalMessage();

        const inferenceResponseMessage = inferenceResponse.content[0].text;
        const inferenceUsage = inferenceResponse.usage;
  
        const newResponse = {role: "assistant", content: inferenceResponseMessage};
  
        inferenceData.messages.push(newResponse);
        inferenceData.usage.input_tokens += inferenceUsage.input_tokens;
        inferenceData.usage.output_tokens += inferenceUsage.output_tokens;
        // console.log(inferenceData);
        await fastify.redis.set(sessionId, JSON.stringify(inferenceData));

        reply.code(200).send();
    });

    done();
}