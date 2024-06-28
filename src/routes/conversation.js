module.exports = function (fastify, opts, done) {
    
    fastify.post('/conversation', async (request, reply) => {

        const incomingMessages = request.body.messages;

        const payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are a friendly open source developer chatbot who always responds in an informal style. Keep responses under 80 words."
                },
                ...incomingMessages
            ],
            "model": "HuggingFaceH4/zephyr-7b-beta"
        }

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