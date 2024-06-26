module.exports = function (fastify, opts, done) {
    

    const payload = {
        "messages": [
            {
                "role": "system",
                "content": "You are a friendly chatbot who always responds in the style of a pirate"
            },
            {
                "role": "user", 
                "content": "Should I invest in bitcoin?"
            }
        ],
        "model": "HuggingFaceH4/zephyr-7b-beta"
    }

    fastify.get('/inference', async (request, reply) => {

        const inferenceCall = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta/v1/chat/completions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const inferenceResponse = await inferenceCall.json();

        reply.send({ response: inferenceResponse.choices[0].message });
    });
    done();
}