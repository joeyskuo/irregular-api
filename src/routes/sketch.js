const sketchData = require('../data/sketchData');

module.exports = function (fastify, opts, done) {
    
    fastify.get('/sketch', (request, reply) => {
        const randomIndex = Math.floor(Math.random() * sketchData.length);
        const randomSketch = sketchData[randomIndex];
        reply.send(randomSketch);
    });
    done();
}