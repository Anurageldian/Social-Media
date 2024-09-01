require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const util = require('util');
const { htmlToText, filterAlphanumericWithDash, getBuffer } = require('./functions');
const { Client } = require('youtubei');
// const { htmlToText, getBuffer, filterAlphanumericWithDash } = require('./functions');
// const { Y2MateClient } = require('y2mate-api');
// const client = new Y2MateClient();
// const logChannelId = process.env.LOGC_ID;



const youtube = new Client();

async function getYoutube(bot, chatId, url, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.');
  try {
    if (url.includes('music.youtube.com')) {
      let newUrl = url.replace('music.youtube.com', 'www.youtube.com');
      let video = await youtube.getVideo(newUrl);
      let audioFormats = video.formats.filter(f => f.mimeType.startsWith('audio/'));
      let audio = audioFormats.find(f => f.itag === '140'); // Use '140' for audio/mp4
      let size = Math.floor(audio.contentLength / 1024 / 1024); // Convert bytes to MB

      if (size > 49) {
        return bot.editMessageText('The file size is more than 50 MB, bots can only download under 50 MB.', { chat_id: chatId, message_id: load.message_id });
      }

      let fname = filterAlphanumericWithDash(video.title) + '.mp3';
      let response = await axios.get(audio.url, { responseType: 'arraybuffer' });
      let buff = Buffer.from(response.data);
      fs.writeFileSync('content/' + fname, buff);
      await bot.editMessageText(`Downloading music ${video.title}, please wait.`, { chat_id: chatId, message_id: load.message_id });
      await bot.sendAudio(chatId, 'content/' + fname, { caption: 'Successful music download ' + video.title });
      await bot.deleteMessage(chatId, load.message_id);
      fs.unlinkSync('content/' + fname);
    } else {
      let video = await youtube.getVideo(url);
      let data = [];
      video.formats.forEach((format, index) => {
        if (format.mimeType.startsWith('video/')) {
          data.push([{ text: `Video ${format.qualityLabel} ${format.contentLength ? ' - ' + (format.contentLength / 1024 / 1024).toFixed(2) + ' MB' : ''}`, callback_data: `ytv ${video.id} ${index}` }]);
        } else if (format.mimeType.startsWith('audio/')) {
          data.push([{ text: `Audio ${format.qualityLabel} ${format.contentLength ? ' - ' + (format.contentLength / 1024 / 1024).toFixed(2) + ' MB' : ''}`, callback_data: `yta ${video.id} ${index}` }]);
        }
      });

      let options = {
        caption: `${video.title}\n\nPlease select the following option!`,
        reply_markup: JSON.stringify({
          inline_keyboard: data
        })
      };
      await bot.sendPhoto(chatId, video.thumbnails[0].url, options);
      await bot.deleteMessage(chatId, load.message_id);
    }
  } catch (err) {
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutube()\n• Url: ${url}\n\n${err}`.trim());
    return bot.editMessageText('An error occurred, make sure your YouTube link is valid!', { chat_id: chatId, message_id: load.message_id });
  }
}

// Similar updates for `getYoutubeVideo` and `getYoutubeAudio`

module.exports = {
  getYoutube,
  // other functions
};
