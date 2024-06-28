require('dotenv').config();
const helloRoute = require('./src/routes/hello');
const sketchRoute = require('./src/routes/sketch');
const inferenceRoute = require('./src/routes/inference');
const conversationRoute = require('./src/routes/conversation');

const fastify = require('fastify')({
  logger: true
})

fastify.register(helloRoute);
fastify.register(sketchRoute);
fastify.register(inferenceRoute);
fastify.register(conversationRoute);

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})