require('dotenv').config();
const sketchRoute = require('./src/routes/sketch');
const conversationRoute = require('./src/routes/conversation');

// initialize fastify
const fastify = require('fastify')({
  logger: true
})

// register routes
fastify.register(sketchRoute);
fastify.register(conversationRoute);

// start server
fastify.listen({ port: 8080 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})