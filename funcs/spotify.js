const axios = require('axios');
const { parse } = require('spotify-uri');
const util = require('util');
const fs = require('fs');
const { getBuffer, filterAlphanumericWithDash } = require('./functions');

const Spotify = {};

Spotify.uri = require('spotify-uri');

// Function to extract playlist or album image URL
Spotify.extractImageUrl = async function(uri) {
  try {
    const parsed = await parse(uri);
    const embedUrl = `https://embed.spotify.com/?uri=${encodeURIComponent(uri)}`;

    // Fetch the Spotify embed page HTML
    const response = await axios.get(embedUrl);
    const $ = cheerio.load(response.data);

    // Extract the image URL from the embed page HTML
    const imageUrl = $('meta[property="og:image"]').attr('content');

    return imageUrl;
  } catch (error) {
    console.error('Error extracting image URL:', error.message);
    throw error;
  }
};

// Update getPlaylistSpotify and getAlbumsSpotify functions to use extracted image URL

async function getPlaylistSpotify(bot, chatId, url, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.');
  try {
    // Extract playlist image URL from Spotify embed URL
    let imageUrl = await Spotify.extractImageUrl(url);

    // Fetch playlist tracks or other necessary data (not shown in this snippet)
    // Replace this with your logic to fetch playlist tracks

    let data = []; // Example data placeholder
    let options = {
      caption:
        'Please select the music you want to download by pressing one of the buttons below!',
      reply_markup: JSON.stringify({
        inline_keyboard: data,
      }),
    };

    await bot.sendPhoto(chatId, imageUrl, options);
    await bot.deleteMessage(chatId, load.message_id);
  } catch (err) {
    console.error('Error getting playlist data:', err);
    await bot.sendMessage(
      process.env.DEV_ID,
      `[ ERROR MESSAGE ]\n\n• Username: ${userName ? `@${userName}` : '-'}\n• Function: getPlaylistSpotify()\n• Url: ${url}\n\n${err}`.trim()
    );
    return bot.editMessageText('Error getting playlist data!', {
      chat_id: chatId,
      message_id: load.message_id,
    });
  }
}

async function getAlbumsSpotify(bot, chatId, url, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.');
  try {
    // Extract album image URL from Spotify embed URL
    let imageUrl = await Spotify.extractImageUrl(url);

    // Fetch album tracks or other necessary data (not shown in this snippet)
    // Replace this with your logic to fetch album tracks

    let data = []; // Example data placeholder
    let options = {
      caption:
        'Please select the music you want to download by pressing one of the buttons below!',
      reply_markup: JSON.stringify({
        inline_keyboard: data,
      }),
    };

    await bot.sendPhoto(chatId, imageUrl, options);
    await bot.deleteMessage(chatId, load.message_id);
  } catch (err) {
    console.error('Error getting album data:', err);
    await bot.sendMessage(
      process.env.DEV_ID,
      `[ ERROR MESSAGE ]\n\n• Username: ${userName ? `@${userName}` : '-'}\n• Function: getAlbumsSpotify()\n• Url: ${url}\n\n${err}`.trim()
    );
    return bot.editMessageText('Error getting album data!', {
      chat_id: chatId,
      message_id: load.message_id,
    });
  }
}

async function getSpotifySong(bot, chatId, url, userName) {
  let load = await bot.sendMessage(chatId, 'Loading, please wait.');
  try {
    // Example logic to download song (not shown in this snippet)
    // Replace with your implementation

    await bot.editMessageText(
      'Downloading song, please wait...',
      { chat_id: chatId, message_id: load.message_id }
    );

    // Example download logic (not shown in this snippet)
    // Replace with your logic to download the song
  } catch (err) {
    console.error('Error in getSpotifySong:', err);
    await bot.sendMessage(
      process.env.DEV_ID,
      `[ ERROR MESSAGE ]\n\n• Username: ${userName ? `@${userName}` : '-'}\n• Function: getSpotifySong()\n• Url: ${url}\n\n${err}`.trim()
    );
    return bot.editMessageText('Failed to download song!', { chat_id: chatId, message_id: load.message_id });
  }
}

module.exports = {
  getPlaylistSpotify,
  getAlbumsSpotify,
  getSpotifySong,
};
