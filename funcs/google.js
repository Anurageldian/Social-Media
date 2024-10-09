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
const { search } = require('google-sr');
const logChannelId = process.env.LOGC_ID;

async function googleSearch(bot, chatId, query, userName) {
  if (!query) return bot.sendMessage(chatId, `Enter your Google search query, example\n/google what is javascript`);
  bot.sendChatAction(chatId, 'typing');
  
  try {
    const searchResults = await search({ query: query });

    // Log the search results for debugging
    console.log('Search Results:', searchResults); // To see if results are being returned

    let resultS = `🔍 **Google Search Results** 🔍\n\n`;

    // Check if searchResults contains any data
    if (searchResults.length === 0) {
      return bot.sendMessage(chatId, 'No results found.');
    }

    // Loop through search results
    for (let i = 0; i < Math.min(5, searchResults.length); i++) {
      const result = searchResults[i];
      
      if (result && result.title && result.link && result.description) {
        resultS += `• Title: ${result.title}\n• Link: ${result.link}\n• Description: ${result.description}\n\n`;
      }
    }

    // Send the message with the results
    return bot.sendMessage(chatId, resultS);
  } catch (err) {
    // Log the error to the log channel and notify the user
    await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/google.js\n• Function: googleSearch()\n• Input: ${query}\n\n${err}`.trim());
    return bot.sendMessage(chatId, 'An error occurred!');
  }
}

module.exports = {
  googleSearch
};
