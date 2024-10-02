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

const ytdl = require('ytdl-core');
const fs = require('fs');

async function getYoutubeInfo(bot, chatId, url, userName) {
    let load = await bot.sendMessage(chatId, 'Loading video info, please wait.');
    try {
        const info = await ytdl.getInfo(url);  // Fetch video info

        // Process video info and present options to user
        const videoFormats = ytdl.filterFormats(info.formats, 'videoonly');
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

        let options = [];

        videoFormats.forEach((format, index) => {
            options.push([{ 
                text: `Video ${format.qualityLabel} - ${Math.floor(format.contentLength / (1024 * 1024))}MB`, 
                callback_data: `video ${format.itag}`
            }]);
        });

        audioFormats.forEach((format, index) => {
            options.push([{ 
                text: `Audio ${format.audioBitrate}kbps - ${Math.floor(format.contentLength / (1024 * 1024))}MB`, 
                callback_data: `audio ${format.itag}` 
            }]);
        });

        let messageOptions = {
            caption: `${info.videoDetails.title}\n\nPlease select the desired quality or audio:`,
            reply_markup: JSON.stringify({
                inline_keyboard: options
            })
        };

        await bot.sendPhoto(chatId, info.videoDetails.thumbnails[0].url, messageOptions);
        await bot.deleteMessage(chatId, load.message_id);

    } catch (err) {
        // Send detailed error message for debugging
        console.error('Error while retrieving video information:', err);

        await bot.sendMessage(process.env.DEV_ID, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: youtube.js\n• Function: getYoutubeInfo()\n• Url: ${url}\n\nError: ${err.message}`);
        return bot.editMessageText('An error occurred while retrieving video information.', { chat_id: chatId, message_id: load.message_id });
    }
}


async function downloadYoutube(bot, chatId, url, format, userName) {
    let load = await bot.sendMessage(chatId, 'Downloading, please wait.');

    try {
        // Fetch video info
        const info = await ytdl.getInfo(url);
        const selectedFormat = info.formats.find(f => f.itag == format);

        const fname = `${filterAlphanumericWithDash(info.videoDetails.title)}.${selectedFormat.container}`;
        const filePath = `content/${fname}`;

        // Start downloading the selected format
        await bot.editMessageText(`Downloading ${info.videoDetails.title} in ${selectedFormat.qualityLabel || selectedFormat.audioBitrate}kbps, please wait.`, {
            chat_id: chatId, message_id: load.message_id
        });

        const stream = ytdl.downloadFromInfo(info, { format: selectedFormat });
        stream.pipe(fs.createWriteStream(filePath));

        stream.on('end', async () => {
            // Send the downloaded file to the user
            if (selectedFormat.audioBitrate) {
                await bot.sendAudio(chatId, filePath, { caption: info.videoDetails.title });
            } else {
                await bot.sendVideo(chatId, filePath, { caption: info.videoDetails.title });
            }

            // Clean up the message and temporary file
            await bot.deleteMessage(chatId, load.message_id);
            await fs.unlinkSync(filePath);
        });

    } catch (err) {
        await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: youtube.js\n• Function: downloadYoutube()\n• Url: ${url}\n\n${err}`);
        return bot.editMessageText('An error occurred during the download.', { chat_id: chatId, message_id: load.message_id });
    }
}

module.exports = {
    getYoutubeInfo,
    downloadYoutube
};

