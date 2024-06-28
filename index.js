require('dotenv').config();
const sketchRoute = require('./src/routes/sketch');
const conversationRoute = require('./src/routes/conversation');

const fastify = require('fastify')({
  logger: true
})

fastify.register(sketchRoute);
fastify.register(conversationRoute);

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})