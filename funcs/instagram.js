require('dotenv').config()
const axios = require('axios');
const cheerio = require('cheerio');
const util = require('util');
const fs = require('fs');
const { getBuffer, getRandom } = require('./functions')
const logChannelId = process.env.LOGC_ID;

async function igdl(url) {
  try {
    let { data } = await axios.get(`https://krxuv-api.vercel.app/api/instagram?apikey=Krxuvonly&url=${url}`);
    return data.results
  } catch (err) {
    return err
  }
}

async function setMessageReaction(bot, chatId, messageId, reaction) {
  try {
    await bot.setMessageReaction(chatId, messageId, { reaction });
    console.log(`Reaction '${reaction}' sent to message ${messageId} in chat ${chatId}`);
  } catch (error) {
    console.error(`Failed to send reaction '${reaction}' to message ${messageId} in chat ${chatId}:`, error.response ? error.response.data : error.message);
  }
}



async function downloadInstagram(bot, chatId, url, userName, messageId) {
  // await setMessageReaction(bot, chatId, url, '');
  let load = await bot.sendMessage(chatId, 'Loading, please wait.')
  // await setMessageReaction(bot, chatId, messageId, '');
  try {
    let get = await igdl(url);
    if (!get[0]) {
      return bot.editMessageText('Failed to get data, make sure your Instagram link is valid!', { chat_id: chatId, message_id: load.message_id })
    } else if (get[0]) {
      let res = [];
      let res2 = [];
      if (get.length == 1) {
        if (get[0].type == 'Photo') {
          await bot.deleteMessage(chatId, load.message_id)
          return bot.sendPhoto(chatId, get[0].thumbnail, { caption: `Bot by @firespower` })
        } else {
          try {
            await bot.sendVideo(chatId, get[0].url, { caption: `Bot by @firespower` })
            await bot.sendVideo(logChannelId, get[0].url, { caption: `Bot by @firespower` })
          } catch (err) {
            let buff = await getBuffer(get[0].url);
            await fs.writeFileSync('content/vid-ig-single-' + chatId + '.mp4', buff)
            // await bot.deleteMessage(chatId, load.message_id)
            await bot.sendVideo(chatId, 'content/vid-ig-single-' + chatId + '.mp4', { caption: `Bot by @firespower` })
            await bot.sendVideo(logChannelId, 'content/vid-ig-single-' + chatId + '.mp4', { caption: `Bot by @firespower` })
            await fs.unlinkSync('content/vid-ig-single-' + chatId + '.mp4')
          }
        }
      } else {
        get.forEach(maru => {
          if (maru.type === 'Photo') {
            res.push({ type: 'photo', media: maru.thumbnail })
          } else {
            res2.push({ type: 'video', media: maru.url })
          }
        })
        let currentIndex = 0;
        while (currentIndex < res.length) {
          let mediaToSend = res.slice(currentIndex, currentIndex + 10);
          currentIndex += 10;

          if (mediaToSend.length > 0) {
            await bot.sendMediaGroup(chatId, mediaToSend, { caption: `Bot by @firespower` });
            await bot.sendMediaGroup(logChannelId, mediaToSend, { caption: `Bot by @firespower` });
          }
          }
        }

        res.length = 0;
        res2.map(async (mi) => {
          let nfile = await getRandom('.mp4')
          let buff = await getBuffer(mi.media);
          await fs.writeFileSync('content/' + nfile, buff)
          await bot.sendVideo(chatId, 'content/' + nfile, { caption: `Bot by @firespower` })
          await bot.sendVideo(logChannelId, 'content/' + nfile, { caption: `Bot by @firespower` });
          await fs.unlinkSync('content/' + nfile)
        })

        await bot.deleteMessage(chatId, load.message_id)
      }
    
  } catch (err) {
    await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/instagram.js\n• Function: downloadInstagram()\n• Url: ${url}\n\n${err}`.trim());
    return bot.editMessageText('An error occurred, make sure your Instagram link is valid!', { chat_id: chatId, message_id: load.message_id })
  }
}


module.exports = {
  downloadInstagram
}
