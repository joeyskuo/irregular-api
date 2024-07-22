module.exports = {

    resetTokenCount: async (redis) => {
        await redis.flushall();
        return;
    }
}