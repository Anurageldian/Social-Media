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
const { search } = require('node-duckduckgo');
const logChannelId = process.env.LOGC_ID;

async function googleSearch(bot, chatId, query, userName) {
  if (!query) {
    return bot.sendMessage(chatId, `Enter your search query, example\n/google what is javascript`);
  }
  bot.sendChatAction(chatId, 'typing');

  try {
    const searchResults = await search(query);

    // Log the raw search results to see if they're being returned
    console.log("Raw Search Results:", searchResults);

    // Additional check for results
    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      throw new Error("No results found or unexpected result format");
    }

    let resultS = `DUCKDUCKGO SEARCH\n\n`;
    for (let i = 0; i < Math.min(5, searchResults.length); i++) {
      const result = searchResults[i];
      resultS += `• Title: ${result.title}\n• Link: ${result.url}\n• Description: ${result.snippet}\n\n`;
    }

    return bot.sendMessage(chatId, resultS);
  } catch (err) {
    // Log the error and content of searchResults for debugging
    console.error("Search Error:", err);
    console.error("Search Results Structure:", searchResults);

    await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/google.js\n• Function: googleSearch()\n• Input: ${query}\n\n${err}`.trim());
    return bot.sendMessage(chatId, 'An error occurred!');
  }
}

module.exports = {
  googleSearch
};
