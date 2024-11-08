require('dotenv').config();
const puppeteer = require('puppeteer');
const logChannelId = process.env.LOGC_ID;

async function googleSearch(bot, chatId, query, userName) {
  if (!query) {
    return bot.sendMessage(chatId, `Enter your search query, example\n/google what is javascript`);
  }
  bot.sendChatAction(chatId, 'typing');

  try {
    console.log('Search Query:', query);

    // Launch Puppeteer to control a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set a custom user-agent (optional, to prevent bot detection)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to Bing and search for the query
    await page.goto(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'load' });

    // Wait for a more general results container
    await page.waitForSelector('.b_results', { timeout: 60000 });

    // Extract the search results
    const searchResults = await page.evaluate(() => {
      const results = [];
      const items = document.querySelectorAll('.b_results .b_algo');
      items.forEach((item) => {
        const title = item.querySelector('h2')?.innerText;
        const url = item.querySelector('a')?.href;
        const description = item.querySelector('.b_caption p')?.innerText;
        if (title && url) {
          results.push({ title, url, description });
        }
      });
      return results;
    });

    // Close the browser
    await browser.close();

    // Log the results for debugging
    console.log('Parsed Search Results:', searchResults);

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
