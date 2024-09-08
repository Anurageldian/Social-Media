// require('dotenv').config();
// const axios = require('axios');
// const fs = require('fs');

// const { htmlToText, getBuffer, filterAlphanumericWithDash } = require('./functions');
// const { Y2MateClient } = require('y2mate-api');
// const client = new Y2MateClient();
// const logChannelId = process.env.LOGC_ID;

require('dotenv').config();
const fs = require('fs');
const util = require('util');
const { exec } = require('child_process');
const { filterAlphanumericWithDash } = require('./functions');
const ytDlp = require('yt-dlp-exec').exec;
const logChannelId = process.env.LOGC_ID;

async function getYoutube(bot, chatId, url, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.');
  try {
    // Fetch metadata using yt-dlp
    ytDlp([url, '--dump-json'], { maxBuffer: 1024 * 5000 }, async (err, stdout) => {
      if (err) {
        throw new Error('Error fetching video metadata');
      }

      const videoData = JSON.parse(stdout);
      const title = filterAlphanumericWithDash(videoData.title);
      const videoId = videoData.id;
      const thumbnail = videoData.thumbnail;
      
      let data = [];
      videoData.formats.forEach((format) => {
        if (format.vcodec !== 'none' && format.filesize && format.filesize < 49 * 1024 * 1024) {
          data.push([{ text: `Video ${format.format_note} - ${Math.round(format.filesize / 1024 / 1024)} MB`, callback_data: `ytv ${videoId} ${format.format_id}` }]);
        } else if (format.acodec !== 'none' && format.filesize && format.filesize < 49 * 1024 * 1024) {
          data.push([{ text: `Audio ${format.format_note} - ${Math.round(format.filesize / 1024 / 1024)} MB`, callback_data: `yta ${videoId} ${format.format_id}` }]);
        }
      });

      let options = {
        caption: `${videoData.title}\n\nPlease select an option below!`,
        reply_markup: JSON.stringify({ inline_keyboard: data }),
      };
      await bot.sendPhoto(chatId, thumbnail, options);
      await bot.deleteMessage(chatId, load.message_id);
    });
  } catch (err) {
    await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• Url: ${url}\n\n${err.message}`);
    await bot.editMessageText('An error occurred, please check the YouTube link!', { chat_id: chatId, message_id: load.message_id });
  }
}

async function downloadMedia(bot, chatId, videoId, formatId, mediaType, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.');
  try {
    const output = `content/${videoId}_${formatId}.${mediaType === 'video' ? 'mp4' : 'mp3'}`;

    // Downloading the media using yt-dlp
    ytDlp([`https://www.youtube.com/watch?v=${videoId}`, '-f', formatId, '-o', output], { maxBuffer: 1024 * 5000 }, async (err) => {
      if (err) {
        throw new Error('Error downloading media');
      }

      if (mediaType === 'video') {
        await bot.sendVideo(chatId, output, { caption: 'Video download successful' });
        await bot.sendVideo(logChannelId, output, { caption: 'Video download successful' });
      } else {
        await bot.sendAudio(chatId, output, { caption: 'Audio download successful' });
        await bot.sendAudio(logChannelId, output, { caption: 'Audio download successful' });
      }

      await bot.deleteMessage(chatId, load.message_id);
      await fs.unlinkSync(output);
    });
  } catch (err) {
    await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• Video ID: ${videoId}\n\n${err.message}`);
    await bot.editMessageText('An error occurred while downloading the media!', { chat_id: chatId, message_id: load.message_id });
  }
}

module.exports = {
  getYoutube,
  downloadMedia
};
