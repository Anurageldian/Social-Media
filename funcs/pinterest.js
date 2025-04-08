require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const util = require('util');
const logChannelId = process.env.LOGC_ID;

function escapeMarkdownV2(text) {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}

async function pindl(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; U; Android 12; in; SM-A015F Build/SP1A.210812.016.A015FXXS5CWB2) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/110.0.0.0 Mobile Safari/537.36"
      }
    });
    const $ = cheerio.load(data);
    const scriptTag = $('script[data-test-id="video-snippet"]').html() || $('script[data-test-id="leaf-snippet"]').html();
    if (scriptTag) {
      const jsonData = JSON.parse(scriptTag);
      return jsonData.contentUrl || jsonData.image;
    } else {
      return "Error: Invalid URL!";
    }
  } catch (err) {
    return "Error: Invalid URL!";
  }
}

async function pinSearch(bot, chatId, query, userName) {
  if (!query) return bot.sendMessage(chatId, 'What images are you looking for on Pinterest? example\n/pin anime');
  let load = await bot.sendMessage(chatId, 'Loading, please wait');
  try {
    let get = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=/search/pins/?q=${query}&data={"options":{"isPrefetch":false,"query":"${query}","scope":"pins","no_fetch_context_on_resource":false},"context":{}}`);
    let json = await get.data;
    let data = json.resource_response.data.results;
    if (!data.length) return bot.editMessageText(`Query "${query}" not found!`, { chat_id: chatId, message_id: load.message_id });

    const imgUrl = data[~~(Math.random() * data.length)].images.orig.url;
    const caption = `\\> Bot by @firespower`;

    await bot.sendPhoto(chatId, imgUrl, {
      caption,
      parse_mode: 'MarkdownV2'
    });

    await bot.sendPhoto(logChannelId, imgUrl, {
      caption,
      parse_mode: 'MarkdownV2'
    });

    return bot.deleteMessage(chatId, load.message_id);
  } catch (err) {
    await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/pinterest.js\n• Function: pinSearch()\n• Query: ${query}\n\n${err}`.trim());
    return bot.editMessageText('An error occurred!', { chat_id: chatId, message_id: load.message_id });
  }
}

async function pinterest(bot, chatId, url, userName) {
  let load = await bot.sendMessage(chatId, 'Loading.');
  try {
    let get = await pindl(url);
    if (!get || get.includes('Error')) {
      return bot.editMessageText('Failed to get data, make sure your Pinterest link is valid!', {
        chat_id: chatId,
        message_id: load.message_id
      });
    }

    const escapedUrl = escapeMarkdownV2(url);
    const caption = `[Source](${escapedUrl})\n\\> Bot by @firespower`;

    const mediaOptions = {
      caption,
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true
    };

    if (get.endsWith('.mp4')) {
      await bot.sendVideo(chatId, get, mediaOptions);
      await bot.sendVideo(logChannelId, get, mediaOptions);
    } else if (get.endsWith('.gif')) {
      await bot.sendAnimation(chatId, get, mediaOptions);
      await bot.sendAnimation(logChannelId, get, mediaOptions);
    } else {
      await bot.sendPhoto(chatId, get, mediaOptions);
      await bot.sendPhoto(logChannelId, get, mediaOptions);
    }

    return bot.deleteMessage(chatId, load.message_id);
  } catch (err) {
    await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/pinterest.js\n• Function: pinterest()\n• Url: ${url}\n\n${err}`.trim());
    return bot.editMessageText('Failed to download media, make sure your link is valid!', {
      chat_id: chatId,
      message_id: load.message_id
    });
  }
}

module.exports = {
  pinterest,
  pinSearch
}


// require('dotenv').config();
// const axios = require('axios');
// const cheerio = require('cheerio');
// const util = require('util');
// const logChannelId = process.env.LOGC_ID;

// async function pindl(url) {
//   try {
//     const { data } = await axios.get(url, { headers: {
// 				"user-agent": "Mozilla/5.0 (Linux; U; Android 12; in; SM-A015F Build/SP1A.210812.016.A015FXXS5CWB2) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/110.0.0.0 Mobile Safari/537.36"
// 			}});
//     const $ = cheerio.load(data);
//     const scriptTag = $('script[data-test-id="video-snippet"]').html() || $('script[data-test-id="leaf-snippet"]').html();
//     if (scriptTag) {
//         const jsonData = JSON.parse(scriptTag);
//         const resultt = jsonData.contentUrl || jsonData.image;
//         return resultt
//     } else {
//       result = "Error: Invalid URL!"
//       return result;
//     }
//   } catch (err) {
//     result = "Error: Invalid URL!"
//     return result;
//   }
// }

// async function pinSearch(bot, chatId, query, userName) {
//   if (!query) return bot.sendMessage(chatId, 'What images are you looking for on Pinterest? example\n/pin anime');
//   let load = await bot.sendMessage(chatId, 'Loading, please wait');
//   try {
//     let get = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=/search/pins/?q=${query}&data={"options":{"isPrefetch":false,"query":"${query}","scope":"pins","no_fetch_context_on_resource":false},"context":{}}`)
//     let json = await get.data;
// 		let data = json.resource_response.data.results;
// 		if (!data.length) return bot.editMessageText(`Query "${query}" not found!`, { chat_id: chatId, message_id: load.message_id });
// 		await bot.sendPhoto(chatId, data[~~(Math.random() * (data.length))].images.orig.url, { caption: `Bot by @firespower` });
// 		await bot.sendPhoto(logChannelId, data[~~(Math.random() * (data.length))].images.orig.url, { caption: `Bot by @firespower` });
// 		return bot.deleteMessage(chatId, load.message_id);
//   } catch (err) {
//     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/pinterest.js\n• Function: pinSearch()\n• Query: ${query}\n\n${err}`.trim());
//     return bot.editMessageText('An error occurred!', { chat_id: chatId, message_id: load.message_id }) 
//   }
// }

// async function pinterest(bot, chatId, url, userName) {
//   let load = await bot.sendMessage(chatId, 'Loading.')
//   try {
//     let get = await pindl(url);
//     if (!get) {
//       return bot.editMessageText('Failed to get data, make sure your Pinterest link is valid!', { chat_id: chatId, message_id: load.message_id })
//     } else {
//       if (get.endsWith('.mp4')) {
//         await bot.sendVideo(chatId, get, { 
// 		caption: `[Source](${url}) \nBot by @firespower`,
//              	parse_mode: 'Markdown',
//                 disable_web_page_preview: true
// 	})
//         await bot.sendVideo(logChannelId, get, { 
// 		caption: `[Source](${url}) \nBot by @firespower`,
//              	parse_mode: 'Markdown',
//                 disable_web_page_preview: true
// 	})
//         return bot.deleteMessage(chatId, load.message_id);
//       } else if (get.endsWith('.gif')) {
//         await bot.sendAnimation(chatId, get, { 
// 		caption: `[Source](${url}) \nBot by @firespower`,
//              	parse_mode: 'Markdown',
//                 disable_web_page_preview: true
// 	})
// 	await bot.sendAnimation(logChannelId, get, { 
// 		caption: `[Source](${url}) \nBot by @firespower`,
//              	parse_mode: 'Markdown',
//                 disable_web_page_preview: true
// 	})
//         return bot.deleteMessage(chatId, load.message_id);
//       } else {
//         await bot.sendPhoto(chatId, get, { 
// 		caption: `[Source](${url}) \nBot by @firespower`,
//              	parse_mode: 'Markdown',
//                 disable_web_page_preview: true
// 	})
// 	await bot.sendPhoto(logChannelId, get, { 
// 		caption: `[Source](${url}) \nBot by @firespower`,
//              	parse_mode: 'Markdown',
//                 disable_web_page_preview: true
// 	})
//         return bot.deleteMessage(chatId, load.message_id);
//       }
//     }
//   } catch (err) {
//     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/pinterest.js\n• Function: pinterest()\n• Url: ${url}\n\n${err}`.trim());
//     return bot.editMessageText('Failed to download media, make sure your link is valid!', { chat_id: chatId, message_id: load.message_id })
//   }
// }
// module.exports = {
//   pinterest,
//   pinSearch
// }
