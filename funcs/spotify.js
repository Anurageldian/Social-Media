require("dotenv").config();
const axios = require("axios");
const { parse } = require("spotify-uri");
const util = require("util");
const { getBuffer, filterAlphanumericWithDash } = require("./functions");
const fs = require("fs");

/*
** Endpoints **
https://spotify-downloader1.p.rapidapi.com

* Download Song
/download/{id}

* Metadata Playlist
/metadata/playlist/{id}

* Track Playlist
/trackList/playlist/{id}

*/

async function spotifyScraper(id, endpoint) {
  const options = {
    method: 'GET',
    url: `https://spotify-downloader1.p.rapidapi.com/${endpoint}/${id}`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'spotify-downloader1.p.rapidapi.com'
    }
  };

  try {
    const { data } = await axios.request(options);
    if (!data.success) {
      throw new Error(data.message || "Unknown error occurred");
    }
    return data;
  } catch (err) {
    console.error("Error in spotifyScraper:", err.response ? err.response.data : err.message);
    return null;
  }
}

async function getPlaylistSpotify(bot, chatId, url, userName) {
  let pars = await parse(url);
  let load = await bot.sendMessage(chatId, "Loading, please wait.");
  try {
    let getdata = await spotifyScraper(pars.id, "trackList/playlist");
    if (!getdata) {
      throw new Error("Failed to fetch playlist data");
    }
    let data = [];
    getdata.trackList.forEach((maru) => {
      data.push([{ text: `${maru.title} - ${maru.artists}`, callback_data: "spt " + maru.id }]);
    });
    let options = {
      caption: "Please select the music you want to download by pressing one of the buttons below!",
      reply_markup: JSON.stringify({
        inline_keyboard: data
      })
    };
    await bot.sendPhoto(chatId, "https://telegra.ph/file/a41e47f544ed99dd33783.jpg", options);
    await bot.deleteMessage(chatId, load.message_id);
  } catch (err) {
    console.error("Error in getPlaylistSpotify:", err);
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getPlaylistSpotify()\n• Url: ${url}\n\n${err.message}`.trim());
    return bot.editMessageText("Error getting playlist data!", { chat_id: chatId, message_id: load.message_id });
  }
}

async function getAlbumsSpotify(bot, chatId, url, userName) {
  let pars = await parse(url);
  let load = await bot.sendMessage(chatId, "Loading, please wait.");
  try {
    let getdata = await spotifyScraper(pars.id, "trackList/album");
    if (!getdata) {
      throw new Error("Failed to fetch album data");
    }
    let data = [];
    getdata.trackList.forEach((maru) => { data.push([{ text: `${maru.title} - ${maru.artists}`, callback_data: "spt " + maru.id }]) });
    let options = {
      caption: "Please select the music you want to download by pressing one of the buttons below!",
      reply_markup: JSON.stringify({ inline_keyboard: data })
    };
    await bot.sendPhoto(chatId, "https://telegra.ph/file/a41e47f544ed99dd33783.jpg", options);
    await bot.deleteMessage(chatId, load.message_id);
  } catch (err) {
    console.error("Error in getAlbumsSpotify:", err);
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getAlbumsSpotify()\n• Url: ${url}\n\n${err.message}`.trim());
    return bot.editMessageText("Error getting album data!", { chat_id: chatId, message_id: load.message_id });
  }
}

async function getSpotifySong(bot, chatId, url, userName) {
  let load = await bot.sendMessage(chatId, "Loading, please wait.");
  try {
    if (url.includes("spotify.com")) {
      let pars = await parse(url);
      let getdata = await spotifyScraper(pars.id, "download");
      if (!getdata) {
        throw new Error("Failed to fetch song data");
      }
      let fname = `${filterAlphanumericWithDash(getdata.metadata.title)}-${filterAlphanumericWithDash(getdata.metadata.artists)}_${chatId}.mp3`;
      if (getdata.success) {
        await bot.editMessageText(`Downloading song ${getdata.metadata.title} - ${getdata.metadata.artists}, please wait...`, { chat_id: chatId, message_id: load.message_id });
        let buff = await getBuffer(getdata.link);
        await fs.writeFileSync("content/" + fname, buff);
        await bot.sendAudio(chatId, "content/" + fname, { caption: `Success download song ${getdata.metadata.title} - ${getdata.metadata.artists}` });
        await bot.deleteMessage(chatId, load.message_id);
        await fs.unlinkSync("content/" + fname);
      } else {
        await bot.editMessageText("Error, failed to get data", { chat_id: chatId, message_id: load.message_id });
      }
    } else {
      let getdata = await spotifyScraper(url, "download");
      if (!getdata) {
        throw new Error("Failed to fetch song data");
      }
      let fname = `${filterAlphanumericWithDash(getdata.metadata.title)}-${filterAlphanumericWithDash(getdata.metadata.artists)}_${chatId}.mp3`;
      if (getdata.success) {
        await bot.editMessageText(`Downloading song ${getdata.metadata.title} - ${getdata.metadata.artists}, please wait...`, { chat_id: chatId, message_id: load.message_id });
        let buff = await getBuffer(getdata.link);
        await fs.writeFileSync("content/" + fname, buff);
        await bot.sendAudio(chatId, "content/" + fname, { caption: `Success download song ${getdata.metadata.title} - ${getdata.metadata.artists}` });
        await bot.deleteMessage(chatId, load.message_id);
        await fs.unlinkSync("content/" + fname);
      } else {
        await bot.editMessageText("Error, failed to get data", { chat_id: chatId, message_id: load.message_id });
      }
    }
  } catch (err) {
    console.error("Error in getSpotifySong:", err);
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getSpotifySong()\n• Url: ${url}\n\n${err.message}`.trim());
    return bot.editMessageText("Failed to download song!", { chat_id: chatId, message_id: load.message_id });
  }
}

module.exports = {
  getPlaylistSpotify,
  getAlbumsSpotify,
  getSpotifySong,
};
