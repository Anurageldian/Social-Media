require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const util = require('util');
const { htmlToText, getBuffer, filterAlphanumericWithDash } = require('./functions');
const { Y2MateClient } = require('y2mate-api');
const client = new Y2MateClient();

const youtubeScraper = require('@vreden/youtube_scraper');

// Download YouTube content
async function getYoutube(bot, chatId, url, userName) {
    const load = await bot.sendMessage(chatId, 'Loading, please wait...');
    try {
        // Fetch video details
        const videoDetails = await youtubeScraper.videoInfo(url);

        // Generate options for video and audio
        const options = [];
        for (const format of videoDetails.formats) {
            const { mimeType, url: downloadUrl, contentLength } = format;

            // Determine type and size
            const isAudio = mimeType.startsWith('audio/');
            const sizeMB = (Number(contentLength) / (1024 * 1024)).toFixed(2);

            // Skip large files
            if (sizeMB > 50) continue;

            options.push([
                {
                    text: `${isAudio ? 'Audio' : 'Video'} - ${sizeMB} MB`,
                    callback_data: `${isAudio ? 'yta' : 'ytv'} ${downloadUrl} ${videoDetails.title}`,
                },
            ]);
        }

        if (options.length === 0) {
            return bot.editMessageText(
                'No suitable download options found (all are larger than 50 MB).',
                { chat_id: chatId, message_id: load.message_id }
            );
        }

        // Send options to the user
        await bot.sendMessage(chatId, `Choose a format for: *${videoDetails.title}*`, {
            reply_markup: {
                inline_keyboard: options,
            },
            parse_mode: 'Markdown',
        });

        await bot.deleteMessage(chatId, load.message_id);
    } catch (err) {
        console.error(err);
        await bot.sendMessage(
            String(process.env.DEV_ID),
            `[ERROR]\nUser: @${userName}\nURL: ${url}\nError: ${err.message}`
        );
        await bot.editMessageText('An error occurred while processing your request.', {
            chat_id: chatId,
            message_id: load.message_id,
        });
    }
}

// Handle callback query for download
async function handleCallback(bot, chatId, callbackData, userName) {
    const [type, downloadUrl, title] = callbackData.split(' ');

    const load = await bot.sendMessage(chatId, 'Downloading, please wait...');
    try {
        const buffer = await getBuffer(downloadUrl);
        const sanitizedTitle = filterAlphanumericWithDash(title);
        const fileName = `${sanitizedTitle}.${type === 'yta' ? 'mp3' : 'mp4'}`;
        const filePath = `content/${fileName}`;

        fs.writeFileSync(filePath, buffer);

        // Send the file to the user
        if (type === 'yta') {
            await bot.sendAudio(chatId, filePath, { caption: `*${title}*`, parse_mode: 'Markdown' });
        } else {
            await bot.sendVideo(chatId, filePath, { caption: `*${title}*`, parse_mode: 'Markdown' });
        }

        fs.unlinkSync(filePath);
        await bot.deleteMessage(chatId, load.message_id);
    } catch (err) {
        console.error(err);
        await bot.sendMessage(
            String(process.env.DEV_ID),
            `[ERROR]\nUser: @${userName}\nDownload URL: ${downloadUrl}\nError: ${err.message}`
        );
        await bot.editMessageText('An error occurred while downloading the file.', {
            chat_id: chatId,
            message_id: load.message_id,
        });
    }
}

module.exports = { getYoutube, handleCallback };
