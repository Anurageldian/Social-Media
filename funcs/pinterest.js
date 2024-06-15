require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const util = require('util');

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
      const images = jsonData.image || [];
      const imageUrls = Array.isArray(images) ? images.map(img => img.contentUrl).filter(Boolean) : [images.contentUrl].filter(Boolean);
      return imageUrls;
    } else {
      return ["Error: Invalid URL!"];
    }
  } catch (err) {
    return ["Error: Invalid URL!"];
  }
}

async function pinSearch(bot, chatId, query, userName) {
  if (!query) return bot.sendMessage(chatId, 'What images are you looking for on Pinterest? example\n/pin anime');
  let load = await bot.sendMessage(chatId, 'Loading, please wait');
  try {
    let get = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=/search/pins/?q=${query}&data={"options":{"isPrefetch":false,"query":"${query}","scope":"pins","no_fetch_context_on_resource":false},"context":{}}`)
    let json = await get.data;
		let data = json.resource_response.data.results;
		if (!data.length) return bot.editMessageText(`Query "${query}" not found!`, { chat_id: chatId, message_id: load.message_id });
		await bot.sendPhoto(chatId, data[~~(Math.random() * (data.length))].images.orig.url, { caption: `Bot by @firespower` });
		return bot.deleteMessage(chatId, load.message_id);
  } catch (err) {
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/pinterest.js\n• Function: pinSearch()\n• Query: ${query}\n\n${err}`.trim());
    return bot.editMessageText('An error occurred!', { chat_id: chatId, message_id: load.message_id }) 
  }
}


async function pinterest(bot, chatId, url, userName) {
  let load = await bot.sendMessage(chatId, 'Loading.');
  try {
    let get = await pindl(url);
    if (!get || get.length === 0 || get[0] === "Error: Invalid URL!") {
      return bot.editMessageText('Failed to get data, make sure your Pinterest link is valid!', { chat_id: chatId, message_id: load.message_id });
    } else {
      for (let mediaUrl of get) {
        if (mediaUrl.endsWith('.mp4')) {
          await bot.sendVideo(chatId, mediaUrl, { caption: `Bot by @firespower` });
        } else if (mediaUrl.endsWith('.gif')) {
          await bot.sendAnimation(chatId, mediaUrl, { caption: `Bot by @firespower` });
        } else {
          await bot.sendPhoto(chatId, mediaUrl, { caption: `Bot by @firespower` });
        }
      }
      return bot.deleteMessage(chatId, load.message_id);
    }
  } catch (err) {
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/pinterest.js\n• Function: pinterest()\n• Url: ${url}\n\n${err}`.trim());
    return bot.editMessageText('Failed to download media, make sure your link is valid!', { chat_id: chatId, message_id: load.message_id });
  }
}
module.exports = {
  pinterest,
  pinSearch
}
