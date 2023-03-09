import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const axios = require('axios');
const openai = require('openai');
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]
});

const prompt = "Hello, I'm a chatbot. What would you like to talk about?";
const chatbotParams = {
  temperature: 0.7,
  maxTokens: 3000,
  topP: 1,
  frequencyPenalty: 0.7,
  presencePenalty: 0
};

// Define a function to generate a response from the ChatGPT model
async function generateResponse(prompt, chatbotParams) {
  const response = await axios({
    method: 'post',
    //url: 'https://api.openai.com/v1/engines/text-davinci-003/completions',
    url: 'https://api.openai.com/v1/engines/text-davinci-003/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    data: {
      prompt: prompt,
      temperature: chatbotParams.temperature,
      max_tokens: chatbotParams.maxTokens,
      top_p: chatbotParams.topP,
      frequency_penalty: chatbotParams.frequencyPenalty,
      presence_penalty: chatbotParams.presencePenalty,
      n : 1
    }
  });
  
  let reply = response.data.choices[0].text.trim();
  return reply;
}

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('messageCreate', async (message) => {
    let messageContent = message.content;
    messageContent = messageContent.substring(0,8);
    if (message.content === '/start') {
      const responseText = "👋Hello there!\n\n"
                            + "You can chat with this bot, using [AiHey](https://aihey.co)\n\n"
                            + "**Example:** Send a message like\n"
                            + "*/heychat I'd like to know about you*\n\n"
                            + "Enjoy! 💖 #AiHey";
      await message.reply(responseText);
    } else if (message.content === '/help') {
        const responseText = "Send a message like\n"
                            + "*/heychat I'd like to know about you*\n\n"
                            + "to chat with this bot."
      await message.reply(responseText);
    } else if (messageContent === '/heychat') {
        console.log(message);
        let userText = message.content.replace("/heychat", "");
        userText = userText.replace("\n", ".");
        let promptText = prompt + "\nUser: " + userText;
        const chatbotResponse = await generateResponse(promptText, chatbotParams);
        await message.reply(chatbotResponse,);
    }
    else if (message.content.length > 0 && message.author.username != 'MagicBot'){
        const responseText = "👋Hello there!\n\n"
                            + "You can chat with this bot, using [AiHey](https://aihey.co)\n\n"
                            + "**Example:** Send a message like\n"
                            + "*/heychat I'd like to know about you*\n\n"
                            + "Enjoy! 💖 #AiHey"
        await message.reply(responseText);
    }
});

client.login(process.env.DISCORD_TOKEN);
