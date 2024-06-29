const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
});

const modelConfig = {
  model: "claude-3-haiku-20240307",
  max_tokens: 500,
  temperature: 0.7
}

const users = {};

module.exports = function (fastify, opts, done) {
    
    fastify.post('/inference', async (request, reply) => {

      console.log(request.headers);
      console.log(request.headers['session-id']);
      console.log(request.ip);

      const sessionId = request.headers['session-id'];
      // const sessionId = request.ip;
      const prompt = request.body.prompt;
      const newMessage = {role: "user", content: prompt};
      const newResponse = {role: "assistant", content: "new response here!"};

      if(users[sessionId]) {
        users[sessionId].messages.push(newMessage);
        users[sessionId].messages.push(newResponse);
      } else {
        users[sessionId] = {messages: []};
        users[sessionId].messages.push(newMessage);
        users[sessionId].messages.push(newResponse);
      }
      const msg = users[sessionId].messages;

        // const msg = await anthropic.messages.create({
        //   ...modelConfig,
        //   messages: [{ role: "user", content: "say hello" },
        //     { role: "assistant", content: "Hello!" },
        //     { role: "user", content: "whats the difference between NLP and LLM?" },
        //     { role: "assistant", content: "NLP (Natural Language Processing) and LLM (Large Language Models) are related but distinct concepts in the field of artificial intelligence and machine learning.\n\nNLP:\n- NLP is a broad field that focuses on the interaction between human language and computers.\n- It involves techniques and algorithms for understanding, interpreting, and generating human language, including tasks like text classification, sentiment analysis, machine translation, and question-answering.\n- NLP encompasses a wide range of techniques and approaches, including rule-based methods, statistical models, and more recently, deep learning-based approaches.\n\nLLM:\n- LLMs, also known as Transformer-based language models, are a specific type of deep learning model that has been trained on vast amounts of text data to understand and generate human language.\n- These models, such as GPT-3, BERT, and T5, are characterized by their ability to capture the complex patterns and relationships within" },
        //     { role: "user", content: "finish the rest of the previous answer" },
        //     { role: "assistant", content: "Okay, here's the rest of the answer:\n\nLLM (Large Language Models):\n- LLMs, also known as Transformer-based language models, are a specific type of deep learning model that has been trained on vast amounts of text data to understand and generate human language.\n- These models, such as GPT-3, BERT, and T5, are characterized by their ability to capture the complex patterns and relationships within language, allowing them to perform a wide range of natural language tasks with impressive performance.\n- LLMs are often considered a subset or a specific application of NLP, as they leverage deep learning techniques to tackle various language-related problems.\n- However, LLMs go beyond traditional NLP methods by leveraging the vast amounts of data and computational power to learn more sophisticated language representations and generate more coherent and contextual outputs.\n- While NLP encompasses a broader range of techniques and applications, LLMs have" },
        //     { role: "user", content: "provide the first word of each of the previous messages" },
        //   ],
        // });

        reply.send({ response: msg });
    });
    done();
}