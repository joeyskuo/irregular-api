require('dotenv').config();
require("./src/sentry/instrument.js");

const Sentry = require("@sentry/node");
const Fastify = require('fastify');
const Redis = require("ioredis");
const Anthropic = require('@anthropic-ai/sdk');

const { ToadScheduler } = require('toad-scheduler');
const JobManager = require('./src/modules/jobManager');
const cors = require("@fastify/cors");

const sketchRoute = require('./src/routes/sketch');
const inferenceRoute = require('./src/routes/inference');

// initialize redis connection
const redis = new Redis();

// initialize anthropic instance
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

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
fastify.decorate('anthropic', anthropic);
fastify.decorate('sessionStore', sessionStore);
fastify.decorate('scheduler', new ToadScheduler());

// register cors
fastify.register(cors, {
  hook: 'preHandler',
	credentials: true,
	strictPreflight: false,
	origin: true,
	methods: ['GET', 'POST', 'OPTIONS'],
})

// register routes
fastify.register(sketchRoute);
fastify.register(inferenceRoute);

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