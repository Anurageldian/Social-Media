require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const logChannelId = process.env.LOGC_ID;

async function googleSearch(bot, chatId, query, userName) {
  if (!query) {
    return bot.sendMessage(chatId, `Enter your search query, example\n/google what is javascript`);
  }
  bot.sendChatAction(chatId, 'typing');

  try {
    console.log('Search Query:', query);

    // Construct the Bing search URL with the entire query, ensuring it's properly encoded
    const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

    // Get the search results HTML page
    const { data } = await axios.get(bingUrl);
    
    // Log the first 2000 characters of the HTML response to inspect
    console.log('Bing HTML Response:', data.substring(0, 2000));  // Log the first 2000 characters

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Try a different selector to capture search results
    const searchResults = [];
    $('.b_algo').each((index, element) => {
      const title = $(element).find('h2').text();
      const url = $(element).find('a').attr('href');
      const description = $(element).find('.b_caption p').text();

      if (title && url) {
        searchResults.push({ title, url, description });
      }
    });

    console.log('Parsed Search Results:', searchResults); // Log parsed results

    if (searchResults.length === 0) {
      return bot.sendMessage(chatId, 'No results found.');
    }

    let resultS = `BING SEARCH RESULTS\n\n`;
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

module.exports = {
  googleSearch
};













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
// require('dotenv').config();
// const axios = require('axios');
// const cheerio = require('cheerio');
// const logChannelId = process.env.LOGC_ID;

// async function googleSearch(bot, chatId, query, userName) {
//   if (!query) {
//     return bot.sendMessage(chatId, `Enter your search query, example\n/google what is javascript`);
//   }
//   bot.sendChatAction(chatId, 'typing');

//   try {
//     // Build the Bing search URL
//     const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

//     // Get the search results HTML page
//     const { data } = await axios.get(bingUrl);
    
//     // Load the HTML into cheerio
//     const $ = cheerio.load(data);

//     // Find all search result elements
//     const searchResults = [];
//     $('li.b_algo').each((index, element) => {
//       const title = $(element).find('h2').text();
//       const url = $(element).find('a').attr('href');
//       const description = $(element).find('p').text();

//       searchResults.push({ title, url, description });
//     });

//     if (searchResults.length === 0) {
//       return bot.sendMessage(chatId, 'No results found.');
//     }

//     let resultS = `BING SEARCH RESULTS\n\n`;
//     for (let i = 0; i < Math.min(5, searchResults.length); i++) {
//       const result = searchResults[i];
//       resultS += `• Title: ${result.title}\n• Link: ${result.url}\n• Description: ${result.description}\n\n`;
//     }

//     return bot.sendMessage(chatId, resultS);
//   } catch (err) {
//     console.error("Search Error:", err);

//     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/google.js\n• Function: googleSearch()\n• Input: ${query}\n\n${err}`.trim());
//     return bot.sendMessage(chatId, 'An error occurred!');
//   }
// }

// module.exports = {
//   googleSearch
// };
