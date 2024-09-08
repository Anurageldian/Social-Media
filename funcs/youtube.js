// // require('dotenv').config();
// // const axios = require('axios');
// // const fs = require('fs');

// // const { htmlToText, getBuffer, filterAlphanumericWithDash } = require('./functions');
// // const { Y2MateClient } = require('y2mate-api');
// // const client = new Y2MateClient();
// // const logChannelId = process.env.LOGC_ID;
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const util = require('util');
const youtubedl = require('youtube-dl-exec');
const { getBuffer, filterAlphanumericWithDash } = require('./functions'); // Ensure these functions are available
const logChannelId = process.env.LOGC_ID;
const cookiesFilePath = path.join(__dirname, 'cookies.txt');

async function getYoutube(bot, chatId, url, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.');
  try {
    let videoInfo = await youtubedl(url, {
      dumpJson: true,
      cookies: cookiesFilePath
    });

    if (videoInfo.ext === 'mp3') {
      let size = parseFloat(videoInfo.filesize.split(' MB')[0]);
      if (size > 49) {
        return bot.editMessageText('The file size is more than 50 MB, bots can only download under 50 MB.', { chat_id: chatId, message_id: load.message_id });
      }
      let fname = filterAlphanumericWithDash(videoInfo.title) + '.mp3';
      let buff = await getBuffer(videoInfo.url);
      await fs.writeFileSync('content/' + fname, buff);
      await bot.sendAudio(chatId, 'content/' + fname, { caption: 'Successful music download ' + videoInfo.title });
      await bot.sendAudio(logChannelId, 'content/' + fname, { caption: 'Successful music download ' + videoInfo.title });
      await bot.deleteMessage(chatId, load.message_id);
      await fs.unlinkSync('content/' + fname);
    } else if (videoInfo.ext === 'mp4') {
      let size = parseFloat(videoInfo.filesize.split(' MB')[0]);
      if (size > 49) {
        return bot.editMessageText('File size is more than 50 MB, the bot can only download files under 50 MB. Please download it in your browser using the following link:\n\n' + videoInfo.url, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true });
      }
      let fname = filterAlphanumericWithDash(videoInfo.title) + '.mp4';
      let buff = await getBuffer(videoInfo.url);
      await fs.writeFileSync('content/' + fname, buff);
      await bot.sendVideo(chatId, 'content/' + fname, { caption: videoInfo.title });
      await bot.sendVideo(logChannelId, 'content/' + fname, { caption: videoInfo.title });
      await bot.deleteMessage(chatId, load.message_id);
      await fs.unlinkSync('content/' + fname);
    } else {
      throw new Error('Unsupported format');
    }
  } catch (err) {
    await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: youtubeDownloader.js\n• Function: getYoutube()\n• Url: ${url}\n\n${err}`.trim());
    return bot.editMessageText('An error occurred, make sure your YouTube link is valid!', { chat_id: chatId, message_id: load.message_id });
  }
}

module.exports = {
  getYoutube
};

// require('dotenv').config();
// const axios = require('axios');
// const util = require('util');
// const youtubedl = require('youtube-dl-exec');
// const fs = require('fs');
// const { htmlToText, getBuffer, filterAlphanumericWithDash } = require('./functions');
// const logChannelId = process.env.LOGC_ID;

// async function getYoutube(bot, chatId, url, userName) {
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.');
//   try {
//     const isMusicUrl = url.includes('music.youtube.com');
//     const targetUrl = isMusicUrl ? url.replace('music.youtube.com', 'www.youtube.com') : url;
    
//     // Fetch video metadata using youtube-dl-exec
//     let videoInfo = await youtubedl(targetUrl, {
//       dumpJson: true,   // Fetch full video details
//     }).catch((err) => {
//       console.error(`Failed to fetch video metadata: ${err.message}`);
//       throw new Error('Video metadata fetch failed.');
//     });

//     if (!videoInfo || !videoInfo.formats) {
//       throw new Error('Invalid YouTube video metadata.');
//     }

//     if (isMusicUrl) {
//       let audioFormat = 'bestaudio';  // You can specify 'mp3' if needed
//       let sizeInMb = videoInfo.filesize ? videoInfo.filesize / (1024 * 1024) : 0;

//       if (sizeInMb > 50) {
//         return bot.editMessageText('The file size is more than 50 MB, bots can only download under 50 MB.', { chat_id: chatId, message_id: load.message_id });
//       }

//       let fname = filterAlphanumericWithDash(videoInfo.title) + '.mp3';
//       await bot.editMessageText(`Downloading music ${videoInfo.title}, please wait.`, { chat_id: chatId, message_id: load.message_id });

//       // Download the audio
//       await youtubedl(targetUrl, {
//         format: audioFormat,
//         output: `content/${fname}`,
//       });

//       await bot.sendAudio(chatId, `content/${fname}`, { caption: 'Successful music download ' + videoInfo.title });
//       await bot.sendAudio(logChannelId, `content/${fname}`, { caption: 'Successful music download ' + videoInfo.title });
//       await bot.deleteMessage(chatId, load.message_id);
//       fs.unlinkSync(`content/${fname}`);
//     } else {
//       let data = [];
//       for (let format of videoInfo.formats) {
//         let title = htmlToText(format.format_note || format.format);
//         let sizeInMb = (format.filesize || 0) / (1024 * 1024);

//         if (format.vcodec !== 'none') {
//           data.push([{ text: `Video ${title} - ${sizeInMb.toFixed(2)} MB`, callback_data: `ytv ${videoInfo.id} ${format.format_id}` }]);
//         }
//         if (format.acodec !== 'none') {
//           data.push([{ text: `Audio ${title} - ${sizeInMb.toFixed(2)} MB`, callback_data: `yta ${videoInfo.id} ${format.format_id}` }]);
//         }
//       }

//       let options = {
//         caption: `${videoInfo.title}\n\nPlease select an option!`,
//         reply_markup: JSON.stringify({
//           inline_keyboard: data,
//         }),
//       };

//       await bot.sendPhoto(chatId, videoInfo.thumbnail, options);
//       await bot.deleteMessage(chatId, load.message_id);
//     }
//   } catch (err) {
//     console.error(`Error in getYoutube: ${err.message}`);
//     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutube()\n• Url: ${url}\n\n${err}`.trim());
//     return bot.editMessageText('An error occurred, make sure your YouTube link is valid!', { chat_id: chatId, message_id: load.message_id });
//   }
// }

// async function getYoutubeVideo(bot, chatId, id, formatId, userName) {
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.');
//   try {
//     let videoUrl = `https://www.youtube.com/watch?v=${id}`;

//     let videoInfo = await youtubedl(videoUrl, {
//       format: formatId,
//       dumpSingleJson: true,
//     }).catch((err) => {
//       console.error(`Failed to fetch video: ${err.message}`);
//       throw new Error('Video fetch failed.');
//     });

//     let sizeInMb = (videoInfo.filesize || 0) / (1024 * 1024);

//     if (sizeInMb > 50) {
//       return bot.editMessageText(
//         `File size is more than 50 MB, the bot can only download files under 50 MB. Please download it in your browser using the following link:\n\n${videoInfo.url}`,
//         { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true }
//       );
//     }

//     let fname = filterAlphanumericWithDash(videoInfo.title) + '.mp4';
//     await bot.editMessageText('Downloading video, please wait.', { chat_id: chatId, message_id: load.message_id });

//     await youtubedl(videoUrl, {
//       format: formatId,
//       output: `content/${fname}`,
//     });

//     await bot.sendVideo(chatId, `content/${fname}`, { caption: videoInfo.title });
//     await bot.sendVideo(logChannelId, `content/${fname}`, { caption: videoInfo.title });
//     await bot.deleteMessage(chatId, load.message_id);
//     fs.unlinkSync(`content/${fname}`);
//   } catch (err) {
//     console.error(`Error in getYoutubeVideo: ${err.message}`);
//     await bot.sendMessage(process.env.DEV_ID, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeVideo()\n• Url: https://www.youtube.com/${id}\n\n${err}`.trim());
//     return bot.editMessageText('An error occurred, failed to download video!', { chat_id: chatId, message_id: load.message_id });
//   }
// }

// async function getYoutubeAudio(bot, chatId, id, formatId, userName) {
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.');
//   try {
//     let videoUrl = `https://www.youtube.com/watch?v=${id}`;

//     let videoInfo = await youtubedl(videoUrl, {
//       format: formatId,
//       dumpSingleJson: true,
//     }).catch((err) => {
//       console.error(`Failed to fetch audio: ${err.message}`);
//       throw new Error('Audio fetch failed.');
//     });

//     let sizeInMb = (videoInfo.filesize || 0) / (1024 * 1024);

//     if (sizeInMb > 50) {
//       return bot.editMessageText(
//         `File size is more than 50 MB, the bot can only download files under 50 MB. Please download it in your browser using the following link:\n\n${videoInfo.url}`,
//         { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true }
//       );
//     }

//     let fname = filterAlphanumericWithDash(videoInfo.title) + '.mp3';
//     await bot.editMessageText('Downloading audio, please wait.', { chat_id: chatId, message_id: load.message_id });

//     await youtubedl(videoUrl, {
//       format: formatId,
//       output: `content/${fname}`,
//     });

//     await bot.sendAudio(chatId, `content/${fname}`, { caption: videoInfo.title });
//     await bot.sendAudio(logChannelId, `content/${fname}`, { caption: videoInfo.title });
//     await bot.deleteMessage(chatId, load.message_id);
//     fs.unlinkSync(`content/${fname}`);
//   } catch (err) {
//     console.error(`Error in getYoutubeAudio: ${err.message}`);
//     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeAudio()\n• Url: https://www.youtube.com/${id}\n\n${err}`.trim());
//     return bot.editMessageText('An error occurred, failed to download audio!', { chat_id: chatId, message_id: load.message_id });
//   }
// }

// module.exports = {
//   getYoutube,
//   getYoutubeVideo,
//   getYoutubeAudio,
// };
