const { SimpleIntervalJob, Task } = require('toad-scheduler');
const CacheManager = require('./cacheManager');

class JobManager {

    constructor(fastify) {
        this.fastify = fastify;
    }

    scheduleJobs = () => {
        const resetTokenCountTask = new Task('resetTokenCount', () => { CacheManager.resetTokenCount(this.fastify.redis) });
        this.scheduleJob(5, resetTokenCountTask);
    }

    scheduleJob = (interval, task) => {

        const job = new SimpleIntervalJob({ seconds: interval }, task);

        this.fastify.scheduler.addSimpleIntervalJob(job);

    }
}

module.exports = JobManager;