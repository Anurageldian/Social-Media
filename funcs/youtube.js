require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const util = require('util');
const { htmlToText, filterAlphanumericWithDash, getBuffer } = require('./functions');
const { Client } = require('youtubei.js');
// const { htmlToText, getBuffer, filterAlphanumericWithDash } = require('./functions');
// const { Y2MateClient } = require('y2mate-api');
// const client = new Y2MateClient();
// const logChannelId = process.env.LOGC_ID;


const youtube = new Client();

async function getYoutube(bot, chatId, url, userName) {
    let load = await bot.sendMessage(chatId, 'Loading, please wait.');
    try {
        await youtube.login(); // Optional: login with YouTube account if needed
        let video = await youtube.getVideo(url);
        let data = [];

        if (url.includes('music.youtube.com')) {
            let newUrl = url.replace('music.youtube.com', 'www.youtube.com');
            video = await youtube.getVideo(newUrl);
        }

        let audioFormats = video.formats.filter(format => format.mimeType.includes('audio'));
        let audioFormat = audioFormats.find(format => format.bitrate === 128000); // Select 128kbps audio format
        let size = Math.floor(audioFormat.contentLength / (1024 * 1024)); // Convert size to MB

        if (size > 49) {
            return bot.editMessageText('The file size is more than 50 MB, bots can only download under 50 MB.', { chat_id: chatId, message_id: load.message_id });
        }

        let fname = filterAlphanumericWithDash(video.title) + '.mp3';
        await bot.editMessageText(`Downloading music ${video.title}, please wait.`, { chat_id: chatId, message_id: load.message_id });
        let buff = await getBuffer(audioFormat.url);
        await fs.writeFileSync('content/' + fname, buff);
        await bot.sendAudio(chatId, 'content/' + fname, { caption: 'Successful music download ' + video.title });
        await bot.deleteMessage(chatId, load.message_id);
        await fs.unlinkSync('content/' + fname);
    } catch (err) {
        await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutube()\n• Url: ${url}\n\n${err}`.trim());
        return bot.editMessageText('An error occurred, make sure your YouTube link is valid!', { chat_id: chatId, message_id: load.message_id });
    }
}

async function getYoutubeVideo(bot, chatId, id, itag, userName) {
    let load = await bot.sendMessage(chatId, 'Loading, please wait.');
    try {
        await youtube.login(); // Optional: login with YouTube account if needed
        let video = await youtube.getVideo(`https://www.youtube.com/watch?v=${id}`);
        let format = video.formats.find(format => format.itag === parseInt(itag));
        let size = Math.floor(format.contentLength / (1024 * 1024)); // Convert size to MB

        if (size > 49) {
            return bot.editMessageText('File size is more than 50 MB, the bot can only download files under 50 MB. Please download it in your browser using the following link\n\n' + format.url, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true });
        }

        let fname = filterAlphanumericWithDash(video.title) + '.mp4';
        await bot.editMessageText('Loading, downloading video ' + video.title, { chat_id: chatId, message_id: load.message_id });
        let buff = await getBuffer(format.url);
        await fs.writeFileSync('content/' + fname, buff);
        await bot.sendVideo(chatId, 'content/' + fname, { caption: video.title });
        await bot.deleteMessage(chatId, load.message_id);
        await fs.unlinkSync('content/' + fname);
    } catch (err) {
        await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeVideo()\n• Url: https://www.youtube.com/${id}\n\n${err}`.trim());
        return bot.editMessageText('An error occurred, failed to download video!', { chat_id: chatId, message_id: load.message_id });
    }
}

async function getYoutubeAudio(bot, chatId, id, itag, userName) {
    let load = await bot.sendMessage(chatId, 'Loading, please wait.');
    try {
        await youtube.login(); // Optional: login with YouTube account if needed
        let video = await youtube.getVideo(`https://www.youtube.com/watch?v=${id}`);
        let format = video.formats.find(format => format.itag === parseInt(itag));
        let size = Math.floor(format.contentLength / (1024 * 1024)); // Convert size to MB

        if (size > 49) {
            return bot.editMessageText('File size is more than 50 MB, the bot can only download files under 50 MB. Please download it in your browser using the following link\n\n' + format.url, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true });
        }

        let fname = filterAlphanumericWithDash(video.title) + '.mp3';
        await bot.editMessageText('Loading, downloading audio ' + video.title, { chat_id: chatId, message_id: load.message_id });
        let buff = await getBuffer(format.url);
        await fs.writeFileSync('content/' + fname, buff);
        await bot.sendAudio(chatId, 'content/' + fname, { caption: video.title });
        await bot.deleteMessage(chatId, load.message_id);
        await fs.unlinkSync('content/' + fname);
    } catch (err) {
        await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeAudio()\n• Url: https://www.youtube.com/${id}\n\n${err}`.trim());
        return bot.editMessageText('An error occurred, failed to download audio!', { chat_id: chatId, message_id: load.message_id });
    }
}

module.exports = {
    getYoutube,
    getYoutubeVideo,
    getYoutubeAudio
};
