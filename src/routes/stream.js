const Anthropic = require('@anthropic-ai/sdk');
const Redis = require("ioredis");
const { createSession } = require("better-sse");
const { Readable } = require('stream');

// const redis = new Redis();
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
    
    fastify.get('/stream', async (request, reply) => {

      console.log('stream triggered!');
      console.log(reply.getHeaders());
      console.log(request.hostname);
      console.log(request.raw.headers['origin']);
      const requestOrigin = request.raw.headers['origin'];
      const sessionConfig = {
        headers: { 'Access-Control-Allow-Origin': requestOrigin },
        keepAlive: null
      }

      // const session = await createSession(request.raw, reply.raw);
      const session = await createSession(request.raw, reply.raw, sessionConfig);

      // session.push("Hello world!");
      // const stream = Readable.from([1, 2, 3]);

      // await session.stream(stream);
      // await anthropic.messages.stream({
      //   ...modelConfig,
      //   messages: [{role: 'user', content: "Hello"}]
      // }).on('text', (text) => {
      //     console.log(text);
      //     session.push(text);
      // });

      session.push("Hello! How can");
      session.push(" I assist you today");
      session.push("?");

      // reply.header('Content-Type', 'text/event-stream').send(stream);
      // reply.raw.writeHead(200, { 'Content-Type': 'text/event-stream', 'Access-Control-Allow-Origin': '*' });
      // reply.raw.write('ok');
      // reply.raw.end();

    });
    done();
}