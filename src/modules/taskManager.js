const { SimpleIntervalJob, Task } = require('toad-scheduler');
const CacheManager = require('./cacheManager');

class TaskManager {

    constructor(fastify) {
        this.fastify = fastify;
        this.resetTokenCountJob = this.createResetTokenCountJob(fastify);
    }

    createResetTokenCountJob = (fastify) => {
        const task = new Task(
            'resetTokenCount',
            () => { CacheManager.resetTokenCount(fastify.redis) }
          );
          
          return new SimpleIntervalJob({ seconds: 5, }, task)
    }
}

module.exports = TaskManager;