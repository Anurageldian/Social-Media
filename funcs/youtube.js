// require('dotenv').config();
// const fs = require('fs');
// const { exec } = require('child_process');
// const { htmlToText, getBuffer, filterAlphanumericWithDash } = require('./functions');

// async function getYoutube(bot, chatId, videoId, userName) {
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.');
//   try {
//     let url = `https://www.youtube.com/watch?v=${videoId}`;
//     exec(`yt-dlp --cookies cookies.txt -F ${url}`, async (error, stdout) => {
//       if (error) {
//         await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• Function: getYoutube()\n• Video ID: ${videoId}\n\n${error}`);
//         return bot.editMessageText('An error occurred, make sure your YouTube link is valid!', { chat_id: chatId, message_id: load.message_id });
//       }
      
//       let formats = stdout.split('\n').slice(3).map(line => line.trim()).filter(line => line);
//       let data = formats.map(format => {
//         let parts = format.split(/\s+/);
//         let formatId = parts[0];
//         let size = parts[parts.length - 1];
//         return [{ text: `Format ${formatId} - ${size}`, callback_data: `yt ${videoId} ${formatId}` }];
//       });
      
//       let options = {
//         caption: `Choose a format to download:`,
//         reply_markup: JSON.stringify({
//           inline_keyboard: data
//         })
//       };
      
//       await bot.sendMessage(chatId, options.caption, options);
//       await bot.deleteMessage(chatId, load.message_id);
//     });
//   } catch (err) {
//     await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• Function: getYoutube()\n• Video ID: ${videoId}\n\n${err}`);
//     return bot.editMessageText('An error occurred, make sure your YouTube link is valid!', { chat_id: chatId, message_id: load.message_id });
//   }
// }

// async function getYoutubeVideo(bot, chatId, videoId, formatId, userName) {
//   let load = await bot.sendMessage(chatId, 'Downloading video, please wait.');
//   try {
//     let url = `https://www.youtube.com/watch?v=${videoId}`;
//     let output = `content/${videoId}.mp4`;
//     exec(`yt-dlp --cookies cookies.txt --no-check-certificate -f ${formatId} -o ${output} ${url}`, async (error) => {
//       if (error) {
//         return bot.editMessageText('Failed to download video!', { chat_id: chatId, message_id: load.message_id });
//       }
//       await bot.sendVideo(chatId, output, { caption: 'Here is your video!' });
//       fs.unlinkSync(output);
//       await bot.deleteMessage(chatId, load.message_id);
//     });
//   } catch (err) {
//     return bot.editMessageText('An error occurred while downloading!', { chat_id: chatId, message_id: load.message_id });
//   }
// }

// async function getYoutubeAudio(bot, chatId, videoId, formatId, userName) {
//   let load = await bot.sendMessage(chatId, 'Downloading audio, please wait.');
//   try {
//     let url = `https://www.youtube.com/watch?v=${videoId}`;
//     let output = `content/${videoId}.mp3`;
//     exec(`yt-dlp --cookies cookies.txt --no-check-certificate -f ${formatId} -o ${output} ${url}`, async (error) => {
//       if (error) {
//         return bot.editMessageText('Failed to download audio!', { chat_id: chatId, message_id: load.message_id });
//       }
//       await bot.sendAudio(chatId, output, { caption: 'Here is your audio!' });
//       fs.unlinkSync(output);
//       await bot.deleteMessage(chatId, load.message_id);
//     });
//   } catch (err) {
//     return bot.editMessageText('An error occurred while downloading!', { chat_id: chatId, message_id: load.message_id });
//   }
// }

// module.exports = { getYoutube, getYoutubeVideo, getYoutubeAudio };


// require('dotenv').config();
// const fs = require('fs');
// const SYTDL = require('s-ytdl');
// const { filterAlphanumericWithDash } = require('./functions');

// async function getYoutube(bot, chatId, url, userName) {
//     let load = await bot.sendMessage(chatId, 'Fetching available formats, please wait...');
//     try {
//         let buttons = [];
//         buttons.push([{ text: '🎵 Audio 32kbps', callback_data: `yta|${url}|1` }]);
//         buttons.push([{ text: '🎵 Audio 64kbps', callback_data: `yta|${url}|2` }]);
//         buttons.push([{ text: '🎵 Audio 128kbps', callback_data: `yta|${url}|3` }]);
//         buttons.push([{ text: '🎵 Audio 192kbps', callback_data: `yta|${url}|4` }]);
        
//         buttons.push([{ text: '🎥 Video 144p', callback_data: `ytv|${url}|1` }]);
//         buttons.push([{ text: '🎥 Video 240p', callback_data: `ytv|${url}|2` }]);
//         buttons.push([{ text: '🎥 Video 360p', callback_data: `ytv|${url}|3` }]);
//         buttons.push([{ text: '🎥 Video 480p', callback_data: `ytv|${url}|4` }]);
//         buttons.push([{ text: '🎥 Video 720p', callback_data: `ytv|${url}|5` }]);
//         buttons.push([{ text: '🎥 Video 1080p', callback_data: `ytv|${url}|6` }]);
//         buttons.push([{ text: '🎥 Video 1440p', callback_data: `ytv|${url}|7` }]);
//         buttons.push([{ text: '🎥 Video 2160p', callback_data: `ytv|${url}|8` }]);
        
//         let options = {
//             caption: `🎬 YouTube Video\n\nSelect the desired quality:`,
//             reply_markup: JSON.stringify({ inline_keyboard: buttons })
//         };
        
//         await bot.sendMessage(chatId, options.caption, options);
//         await bot.deleteMessage(chatId, load.message_id);
//     } catch (err) {
//         await bot.sendMessage(process.env.DEV_ID, `Error in getYoutube()\nUser: @${userName}\nURL: ${url}\n\n${err}`);
//         return bot.editMessageText('An error occurred while processing your request.', { chat_id: chatId, message_id: load.message_id });
//     }
// }

// async function downloadYoutube(bot, chatId, url, quality, type) {
//     let load = await bot.sendMessage(chatId, 'Downloading, please wait...');
//     try {
//         let ext = type === 'audio' ? 'mp3' : 'mp4';
//         let fname = `content/${filterAlphanumericWithDash(url)}.${ext}`;
        
//         const media = await SYTDL.dl(url, quality, type);
//         fs.writeFileSync(fname, media.buffer);
        
//         if (type === 'audio') {
//             await bot.sendAudio(chatId, fname, { caption: 'Here is your audio file.' });
//         } else {
//             await bot.sendVideo(chatId, fname, { caption: 'Here is your video file.' });
//         }
        
//         fs.unlinkSync(fname);
//         await bot.deleteMessage(chatId, load.message_id);
//     } catch (err) {
//         await bot.sendMessage(process.env.DEV_ID, `Error in downloadYoutube()\nURL: ${url}\nQuality: ${quality}\nType: ${type}\n\n${err}`);
//         return bot.editMessageText('An error occurred while downloading.', { chat_id: chatId, message_id: load.message_id });
//     }
// }

// function setupBotHandlers(bot) {
//     bot.on('callback_query', async (query) => {
//         const chatId = query.message.chat.id;
//         const [type, url, quality] = query.data.split('|');
        
//         if (type === 'yta' || type === 'ytv') {
//             await bot.answerCallbackQuery(query.id, { text: 'Processing your request...' });
//             await downloadYoutube(bot, chatId, url, quality, type === 'yta' ? 'audio' : 'video');
//         }
//     });
// }

// module.exports = { getYoutube, downloadYoutube, setupBotHandlers };

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const util = require('util');
const { htmlToText, getBuffer, filterAlphanumericWithDash } = require('./functions');
const { Y2MateClient } = require('y2mate-api');
const client = new Y2MateClient();

async function getYoutube(bot, chatId, url, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.');
  let data = [];
  try {
    if (url.includes('music.youtube.com')) {
      let newUrl = url.replace('music.youtube.com', 'www.youtube.com');
      let get = await client.getFromURL(newUrl, 'vi');
      let getsize = get.linksAudio.get('mp3128' ? 'mp3128' : '140').size
      let size = Math.floor(getsize.replace(' MB', ''))
      if (size > 49) {
        return bot.editMessageText('The file size is more than 50 MB, bots can only download under 50 MB.', { chat_id: chatId, message_id: load.message_id })
      }
      let fname = filterAlphanumericWithDash(get.title) + '.mp3';
      let get2 = await get.linksAudio.get('mp3128' ? 'mp3128' : '140').fetch();
      await bot.editMessageText(`Downloading music ${get.title}, please wait.`, { chat_id: chatId, message_id: load.message_id })
      let buff = await getBuffer(get2.downloadLink);
      await fs.writeFileSync('content/'+fname, buff);
      await bot.sendAudio(chatId, 'content/'+fname, { caption: 'Successful music download ' + get.title })
      await bot.deleteMessage(chatId, load.message_id);
      await fs.unlinkSync('content/'+fname)
    } else {
      let data = [];
      let get = await client.getFromURL(url, 'vi');
      for (let [ind, args] of get.linksVideo) {
        let title = htmlToText(args.name);
        data.push([{ text: `Video ${title}${args.size ? ' - ' + args.size : ''}`, callback_data: `ytv ${get.videoId} ${ind}`}])
      }
      for (let [ind, args] of get.linksAudio) {
        let title = htmlToText(args.name);
        data.push([{ text: `Audio ${title}${args.size ? ' - ' + args.size : ''}`, callback_data: `yta ${get.videoId} ${ind}`}])
      }
      let options = {
        caption: `${get.title}\n\nPlease select the following option!`,
        reply_markup: JSON.stringify({
          inline_keyboard: data
        })
      }
      await bot.sendPhoto(chatId, `https://i.ytimg.com/vi/${get.videoId}/0.jpg`, options)
      await bot.deleteMessage(chatId, load.message_id);
    }
  } catch (err) {
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutube()\n• Url: ${url}\n\n${err}`.trim());
    return bot.editMessageText('An error occurred, make sure your YouTube link is valid!', { chat_id: chatId, message_id: load.message_id })
  }
}

async function getYoutubeVideo(bot, chatId, id, ind, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.')
  try {
    let get = await client.getFromURL('https://www.youtube.com/'+id, 'vi');
    let res = await get.linksVideo.get(ind).fetch();
    let getsize = get.linksVideo.get(ind).size;
    let size = Math.floor(getsize.replace(' MB', ''));
    if (size > 49) {
      return bot.editMessageText('file size is more than 50mb, the bot can only download files under 50mb, please download it in your browser using the following link\n\n' + res.downloadLink, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true })
    }
    let fname = filterAlphanumericWithDash(res.title) + '.mp4';
    await bot.editMessageText('Loading, downloading video ' + get.title, { chat_id: chatId, message_id: load.message_id });
    let buff = await getBuffer(res.downloadLink);
    await fs.writeFileSync('content/'+fname, buff);
    await bot.sendVideo(chatId, 'content/'+fname, { caption: res.title });
    await bot.deleteMessage(chatId, load.message_id);
    await fs.unlinkSync('content/'+fname);
  } catch (err) {
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeVideo()\n• Url: https://www.youtube.com/${id}\n\n${err}`.trim());
    return bot.editMessageText('An error occurred, failed to download video!', { chat_id: chatId, message_id: load.message_id })
  }
}

async function getYoutubeAudio(bot, chatId, id, ind, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.')
  try {
    let get = await client.getFromURL('https://www.youtube.com/'+id, 'vi');
    let res = await get.linksAudio.get(ind).fetch();
    let getsize = get.linksAudio.get(ind).size;
    let size = Math.floor(getsize.replace(' MB', ''));
    if (size > 49) {
      return bot.editMessageText('file size is more than 50mb, the bot can only download files under 50mb, please download it in your browser using the following link\n\n' + res.downloadLink, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true })
    }
    let fname = filterAlphanumericWithDash(res.title) + '.mp3';
    await bot.editMessageText('Loading, downloading audio ' + get.title, { chat_id: chatId, message_id: load.message_id });
    let buff = await getBuffer(res.downloadLink);
    await fs.writeFileSync('content/'+fname, buff);
    await bot.sendAudio(chatId, 'content/'+fname, { caption: res.title });
    await bot.deleteMessage(chatId, load.message_id);
    await fs.unlinkSync('content/'+fname);
  } catch (err) {
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeAudio()\n• Url: https://www.youtube.com/${id}\n\n${err}`.trim());
    return bot.editMessageText('An error occurred, failed to download audio!', { chat_id: chatId, message_id: load.message_id })
  }
}


module.exports = {
  getYoutube,
  getYoutubeVideo,
  getYoutubeAudio
}
