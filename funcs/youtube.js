require('dotenv').config();
const fs = require('fs');
const ytdl = require('ytdl-core');
const { filterAlphanumericWithDash } = require('./functions');

async function getYoutube(bot, chatId, url, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.');
  try {
    if (url.includes('music.youtube.com')) {
      let newUrl = url.replace('music.youtube.com', 'www.youtube.com');
      let info = await ytdl.getInfo(newUrl);
      let audioFormat = ytdl.filterFormats(info.formats, 'audioonly').find(f => f.audioBitrate === 128);
      let size = Math.floor(audioFormat.contentLength / (1024 * 1024)); // Convert to MB

      if (size > 49) {
        return bot.editMessageText('The file size is more than 50 MB, bots can only download under 50 MB.', { chat_id: chatId, message_id: load.message_id });
      }

      let fname = filterAlphanumericWithDash(info.videoDetails.title) + '.mp3';
      await bot.editMessageText(`Downloading music ${info.videoDetails.title}, please wait.`, { chat_id: chatId, message_id: load.message_id });

      ytdl(newUrl, { format: audioFormat })
        .pipe(fs.createWriteStream('content/' + fname))
        .on('finish', async () => {
          await bot.sendAudio(chatId, 'content/' + fname, { caption: 'Successful music download ' + info.videoDetails.title });
          await bot.deleteMessage(chatId, load.message_id);
          await fs.unlinkSync('content/' + fname);
        });

    } else {
      let info = await ytdl.getInfo(url);
      let data = [];

      let videoFormats = ytdl.filterFormats(info.formats, 'videoandaudio');
      videoFormats.forEach((format, ind) => {
        let title = format.qualityLabel;
        data.push([{ text: `Video ${title} - ${Math.floor(format.contentLength / (1024 * 1024))} MB`, callback_data: `ytv ${info.videoDetails.videoId} ${ind}`}]);
      });

      let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      audioFormats.forEach((format, ind) => {
        let title = format.audioBitrate + 'kbps';
        data.push([{ text: `Audio ${title} - ${Math.floor(format.contentLength / (1024 * 1024))} MB`, callback_data: `yta ${info.videoDetails.videoId} ${ind}`}]);
      });

      let options = {
        caption: `${info.videoDetails.title}\n\nPlease select the following option!`,
        reply_markup: JSON.stringify({
          inline_keyboard: data
        })
      };
      await bot.sendPhoto(chatId, `https://i.ytimg.com/vi/${info.videoDetails.videoId}/0.jpg`, options);
      await bot.deleteMessage(chatId, load.message_id);
    }
  } catch (err) {
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutube()\n• Url: ${url}\n\n${err}`.trim());
    return bot.editMessageText('An error occurred, make sure your YouTube link is valid!', { chat_id: chatId, message_id: load.message_id });
  }
}

async function getYoutubeVideo(bot, chatId, id, ind, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.');
  try {
    let url = `https://www.youtube.com/watch?v=${id}`;
    let info = await ytdl.getInfo(url);
    let format = ytdl.filterFormats(info.formats, 'videoandaudio')[ind];
    let size = Math.floor(format.contentLength / (1024 * 1024)); // Convert to MB

    if (size > 49) {
      return bot.editMessageText(`The file size is more than 50 MB. You can download it using the following link:\n\n${format.url}`, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true });
    }

    let fname = filterAlphanumericWithDash(info.videoDetails.title) + '.mp4';
    await bot.editMessageText(`Downloading video ${info.videoDetails.title}, please wait.`, { chat_id: chatId, message_id: load.message_id });

    ytdl(url, { format: format })
      .pipe(fs.createWriteStream('content/' + fname))
      .on('finish', async () => {
        await bot.sendVideo(chatId, 'content/' + fname, { caption: info.videoDetails.title });
        await bot.deleteMessage(chatId, load.message_id);
        await fs.unlinkSync('content/' + fname);
      });

  } catch (err) {
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeVideo()\n• Url: https://www.youtube.com/watch?v=${id}\n\n${err}`.trim());
    return bot.editMessageText('An error occurred, failed to download video!', { chat_id: chatId, message_id: load.message_id });
  }
}

async function getYoutubeAudio(bot, chatId, id, ind, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.');
  try {
    let url = `https://www.youtube.com/watch?v=${id}`;
    let info = await ytdl.getInfo(url);
    let format = ytdl.filterFormats(info.formats, 'audioonly')[ind];
    let size = Math.floor(format.contentLength / (1024 * 1024)); // Convert to MB

    if (size > 49) {
      return bot.editMessageText(`The file size is more than 50 MB. You can download it using the following link:\n\n${format.url}`, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true });
    }

    let fname = filterAlphanumericWithDash(info.videoDetails.title) + '.mp3';
    await bot.editMessageText(`Downloading audio ${info.videoDetails.title}, please wait.`, { chat_id: chatId, message_id: load.message_id });

    ytdl(url, { format: format })
      .pipe(fs.createWriteStream('content/' + fname))
      .on('finish', async () => {
        await bot.sendAudio(chatId, 'content/' + fname, { caption: info.videoDetails.title });
        await bot.deleteMessage(chatId, load.message_id);
        await fs.unlinkSync('content/' + fname);
      });

  } catch (err) {
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeAudio()\n• Url: https://www.youtube.com/watch?v=${id}\n\n${err}`.trim());
    return bot.editMessageText('An error occurred, failed to download audio!', { chat_id: chatId, message_id: load.message_id });
  }
}

module.exports = {
  getYoutube,
  getYoutubeVideo,
  getYoutubeAudio
};

// require('dotenv').config();
// const axios = require('axios');
// const fs = require('fs');
// const util = require('util');
// const { htmlToText, getBuffer, filterAlphanumericWithDash } = require('./functions');
// const { Y2MateClient } = require('y2mate-api');
// const client = new Y2MateClient();

// async function getYoutube(bot, chatId, url, userName) {
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.');
//   let data = [];
//   try {
//     if (url.includes('music.youtube.com')) {
//       let newUrl = url.replace('music.youtube.com', 'www.youtube.com');
//       let get = await client.getFromURL(newUrl, 'vi');
//       let getsize = get.linksAudio.get('mp3128' ? 'mp3128' : '140').size
//       let size = Math.floor(getsize.replace(' MB', ''))
//       if (size > 49) {
//         return bot.editMessageText('The file size is more than 50 MB, bots can only download under 50 MB.', { chat_id: chatId, message_id: load.message_id })
//       }
//       let fname = filterAlphanumericWithDash(get.title) + '.mp3';
//       let get2 = await get.linksAudio.get('mp3128' ? 'mp3128' : '140').fetch();
//       await bot.editMessageText(`Downloading music ${get.title}, please wait.`, { chat_id: chatId, message_id: load.message_id })
//       let buff = await getBuffer(get2.downloadLink);
//       await fs.writeFileSync('content/'+fname, buff);
//       await bot.sendAudio(chatId, 'content/'+fname, { caption: 'Successful music download ' + get.title })
//       await bot.deleteMessage(chatId, load.message_id);
//       await fs.unlinkSync('content/'+fname)
//     } else {
//       let data = [];
//       let get = await client.getFromURL(url, 'vi');
//       for (let [ind, args] of get.linksVideo) {
//         let title = htmlToText(args.name);
//         data.push([{ text: `Video ${title}${args.size ? ' - ' + args.size : ''}`, callback_data: `ytv ${get.videoId} ${ind}`}])
//       }
//       for (let [ind, args] of get.linksAudio) {
//         let title = htmlToText(args.name);
//         data.push([{ text: `Audio ${title}${args.size ? ' - ' + args.size : ''}`, callback_data: `yta ${get.videoId} ${ind}`}])
//       }
//       let options = {
//         caption: `${get.title}\n\nPlease select the following option!`,
//         reply_markup: JSON.stringify({
//           inline_keyboard: data
//         })
//       }
//       await bot.sendPhoto(chatId, `https://i.ytimg.com/vi/${get.videoId}/0.jpg`, options)
//       await bot.deleteMessage(chatId, load.message_id);
//     }
//   } catch (err) {
//     await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutube()\n• Url: ${url}\n\n${err}`.trim());
//     return bot.editMessageText('An error occurred, make sure your YouTube link is valid!', { chat_id: chatId, message_id: load.message_id })
//   }
// }

// async function getYoutubeVideo(bot, chatId, id, ind, userName) {
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.')
//   try {
//     let get = await client.getFromURL('https://www.youtube.com/'+id, 'vi');
//     let res = await get.linksVideo.get(ind).fetch();
//     let getsize = get.linksVideo.get(ind).size;
//     let size = Math.floor(getsize.replace(' MB', ''));
//     if (size > 49) {
//       return bot.editMessageText('file size is more than 50mb, the bot can only download files under 50mb, please download it in your browser using the following link\n\n' + res.downloadLink, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true })
//     }
//     let fname = filterAlphanumericWithDash(res.title) + '.mp4';
//     await bot.editMessageText('Loading, downloading video ' + get.title, { chat_id: chatId, message_id: load.message_id });
//     let buff = await getBuffer(res.downloadLink);
//     await fs.writeFileSync('content/'+fname, buff);
//     await bot.sendVideo(chatId, 'content/'+fname, { caption: res.title });
//     await bot.deleteMessage(chatId, load.message_id);
//     await fs.unlinkSync('content/'+fname);
//   } catch (err) {
//     await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeVideo()\n• Url: https://www.youtube.com/${id}\n\n${err}`.trim());
//     return bot.editMessageText('An error occurred, failed to download video!', { chat_id: chatId, message_id: load.message_id })
//   }
// }

// async function getYoutubeAudio(bot, chatId, id, ind, userName) {
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.')
//   try {
//     let get = await client.getFromURL('https://www.youtube.com/'+id, 'vi');
//     let res = await get.linksAudio.get(ind).fetch();
//     let getsize = get.linksAudio.get(ind).size;
//     let size = Math.floor(getsize.replace(' MB', ''));
//     if (size > 49) {
//       return bot.editMessageText('file size is more than 50mb, the bot can only download files under 50mb, please download it in your browser using the following link\n\n' + res.downloadLink, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true })
//     }
//     let fname = filterAlphanumericWithDash(res.title) + '.mp3';
//     await bot.editMessageText('Loading, downloading audio ' + get.title, { chat_id: chatId, message_id: load.message_id });
//     let buff = await getBuffer(res.downloadLink);
//     await fs.writeFileSync('content/'+fname, buff);
//     await bot.sendAudio(chatId, 'content/'+fname, { caption: res.title });
//     await bot.deleteMessage(chatId, load.message_id);
//     await fs.unlinkSync('content/'+fname);
//   } catch (err) {
//     await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeAudio()\n• Url: https://www.youtube.com/${id}\n\n${err}`.trim());
//     return bot.editMessageText('An error occurred, failed to download audio!', { chat_id: chatId, message_id: load.message_id })
//   }
// }


// module.exports = {
//   getYoutube,
//   getYoutubeVideo,
//   getYoutubeAudio
// }
