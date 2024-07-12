module.exports = {

    resetTokenCount: async (redis) => {
        console.log('resetTokenCount job called...');
        const storedSessionData = await redis.get('irregular-1');
        console.log(storedSessionData);
        return;
    }
}