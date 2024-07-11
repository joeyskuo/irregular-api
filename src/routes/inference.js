const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const modelConfig = {
  model: "claude-3-haiku-20240307",
  max_tokens: 500,
  temperature: 0.7
}

const users = {};

module.exports = function (fastify, opts, done) {
    
    fastify.post('/inference', async (request, reply) => {

      const sessionId = request.headers['session-id'] || request.ip;
      const prompt = request.body.prompt;

      const newMessage = {role: "user", content: prompt};

      const storedSessionData = await fastify.redis.get(sessionId);
      const sessionData = JSON.parse(storedSessionData) ?? {messages: [], usage: {input_tokens: 0, output_tokens: 0}};

      sessionData.messages.push(newMessage);

      const inferenceResponse = await anthropic.messages.create({
        ...modelConfig,
        messages: sessionData.messages
      });

      const inferenceResponseMessage = inferenceResponse.content[0].text;
      const inferenceUsage = inferenceResponse.usage;

      const newResponse = {role: "assistant", content: inferenceResponseMessage};

      sessionData.messages.push(newResponse);
      sessionData.usage.input_tokens += inferenceUsage.input_tokens;
      sessionData.usage.output_tokens += inferenceUsage.output_tokens;
      console.log(sessionData);
      await fastify.redis.set(sessionId, JSON.stringify(sessionData));

      reply.send({ message: inferenceResponseMessage });
    });
    done();
}