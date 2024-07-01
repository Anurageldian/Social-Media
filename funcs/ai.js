require('dotenv').config();
const axios = require('axios');

async function getAiResponse(bot, chatId, input, userName) {
  if (!input) return bot.sendMessage(chatId, `Enter your question, example\n/ai what is javascript`);
  try {
    bot.sendChatAction(chatId, 'typing');
    let { data } = await axios(`http://54.210.182.203:3040/v1/chat/completions`, {
      method: "post",
      data: {
        botId: "default",
        newMessage: input,
        stream: false
      },
      headers: {
        Accept: "text/event-stream",
        "Content-Type": "application/json"
      }
    })
    if (data.success) {
      await bot.sendMessage(chatId, `${data.reply}`.trim(), { parse_mode: 'Markdown' })
    } else if (!data.success) {
      return bot.sendMessage(chatId, 'An error occurred!');
    }
  } catch (err) {
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/ai.js\n• Function: getAiResponse()\n• Input: ${input}\n\n${err}`.trim());
    return bot.sendMessage(chatId, 'An error occurred!');
  }
}

module.exports = {
  getAiResponse
}
