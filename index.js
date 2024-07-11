require('dotenv').config();
const Fastify = require('fastify');
const Redis = require("ioredis");
const { fastifySchedulePlugin } = require('@fastify/schedule');
const sketchRoute = require('./src/routes/sketch');
const conversationRoute = require('./src/routes/conversation');
const inferenceRoute = require('./src/routes/inference');
const dynamicRoute = require('./src/routes/dynamic');

// initialize redis connection
const redis = new Redis();

// initialize fastify
const fastify = Fastify({
  logger: true
});

// add redis to fastify instance
fastify.decorate('redis', redis);

// register plugins
fastify.register(fastifySchedulePlugin);

// register routes
fastify.register(sketchRoute);
fastify.register(conversationRoute);
fastify.register(inferenceRoute);
fastify.register(dynamicRoute);

// start server
fastify.listen({ port: 8080 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})