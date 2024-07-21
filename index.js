require('dotenv').config();
require("./instrument.js");
const Sentry = require("@sentry/node");
const Fastify = require('fastify');
const Redis = require("ioredis");
const { ToadScheduler } = require('toad-scheduler');
const JobManager = require('./src/modules/jobManager');

const sketchRoute = require('./src/routes/sketch');
const conversationRoute = require('./src/routes/conversation');
const inferenceRoute = require('./src/routes/inference');
const dynamicRoute = require('./src/routes/dynamic');

// initialize redis connection
const redis = new Redis();

// create session store
const sessionStore = {};

// initialize fastify
const fastify = Fastify({
  logger: true
});

// add sentry
Sentry.setupFastifyErrorHandler(fastify);

// add redis to fastify instance
fastify.decorate('redis', redis);
fastify.decorate('sessionStore', sessionStore);
fastify.decorate('scheduler', new ToadScheduler());

// register routes
fastify.register(sketchRoute);
fastify.register(conversationRoute);
fastify.register(inferenceRoute);
fastify.register(dynamicRoute);
// create jobs in taskManager
const jobManager = new JobManager(fastify);

// schedule jobs
fastify.ready().then(() => {
  jobManager.scheduleJobs();
})

// start server
fastify.listen({ port: 8080 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})