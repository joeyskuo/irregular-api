const helloRoute = require('./src/routes/hello');
const sketchRoute = require('./src/routes/sketch');

const fastify = require('fastify')({
  logger: true
})

fastify.register(helloRoute);
fastify.register(sketchRoute);

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})