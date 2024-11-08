// require('dotenv').config()
// const { search } = require('google-sr');
// const logChannelId = process.env.LOGC_ID;

// async function googleSearch(bot, chatId, query, userName) {
//   if (!query) return bot.sendMessage(chatId, `Enter your Google search query, example\n/google what is javascript`)
//   bot.sendChatAction(chatId, 'typing');
//   try {
//     const searchResults = await search({ query: query });
//     let resultS = `GOOGLE SEARCH\n\n`
//     for (let i = 0;i < 5;i++) {
//       resultS += `• Title: ${searchResults[i].title}\n• Link: ${searchResults[i].link}\n• Description: ${searchResults[i].description}\n\n`
//     };
//     return bot.sendMessage(chatId, resultS);
//   } catch (err) {
//     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/google.js\n• Function: googleSearch()\n• Input: ${query}\n\n${err}`.trim());
//     return bot.sendMessage(chatId, 'An error occurred!');
//   }
// }

// module.exports = {
//   googleSearch
// }
require('dotenv').config();
const { search } = require('duck-duck-scrape');  // Updated package import
const logChannelId = process.env.LOGC_ID;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function googleSearch(bot, chatId, query, userName) {
  if (!query) {
    return bot.sendMessage(chatId, `Enter your search query, example\n/google what is javascript`);
  }
  bot.sendChatAction(chatId, 'typing');

  try {
    // Adding a delay to avoid rate limits (adjust ms as needed)
    await delay(1000);

    const searchResults = await search(query);

    console.log("Raw Search Results:", searchResults);

    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      throw new Error("No results found or unexpected result format");
    }

    let resultS = `DUCKDUCKGO SEARCH\n\n`;
    for (let i = 0; i < Math.min(5, searchResults.length); i++) {
      const result = searchResults[i];
      resultS += `• Title: ${result.title}\n• Link: ${result.url}\n• Description: ${result.description}\n\n`;
    }

    return bot.sendMessage(chatId, resultS);
  } catch (err) {
    console.error("Search Error:", err);

    await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/google.js\n• Function: googleSearch()\n• Input: ${query}\n\n${err}`.trim());
    return bot.sendMessage(chatId, 'An error occurred!');
  }
}
