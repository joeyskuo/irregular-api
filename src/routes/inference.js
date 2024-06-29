const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
});

const modelConfig = {
  model: "claude-3-haiku-20240307",
  max_tokens: 40,
  temperature: 0.7
}

module.exports = function (fastify, opts, done) {
    
    fastify.post('/inference', async (request, reply) => {

        const msg = await anthropic.messages.create({
          ...modelConfig,
          messages: [{ role: "user", content: "say hello" }],
        });

        reply.send({ response: msg });
    });
    done();
}