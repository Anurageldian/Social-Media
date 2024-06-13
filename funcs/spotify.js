require("dotenv").config()
const axios = require("axios")
const { parse } = require("spotify-uri")
const { getBuffer, filterAlphanumericWithDash } = require("./functions")
const fs = require("fs")

/*
** Endpoints **
https://api.spotifydown.com

* Download Song
/download/

* Metadata Playlist
/metadata/playlist/

* Track Playlist
/trackList/playlist/

*/

async function spotifyScraper(id, endpoint) {
  try {
    let { data } = await axios.get(
      `https://api.spotifydown.com/${endpoint}/${id}`,
      {
        headers: {
          Origin: "https://spotifydown.com",
          Referer: "https://spotifydown.com/",
        }
      })
    return data
  } catch (err) {
    console.error("Error in spotifyScraper:", err)
    return { error: "Error: " + err }
  }
}

async function getPlaylistSpotify(bot, chatId, url, userName) {
  let pars = await parse(url)
  let load = await bot.sendMessage(chatId, "Loading, please wait.")
  try {
    let getdata = await spotifyScraper(`${pars.id}`, "trackList/playlist")

    if (getdata.error) {
      throw new Error(getdata.error)
    }

    let data = []
    getdata.trackList.map((maru) => {
      data.push([{ text: `${maru.title} - ${maru.artists}`, callback_data: "spt " + maru.id }])
    })
    let options = {
      caption: "Please select the music you want to download by pressing one of the buttons below!",
      reply_markup: JSON.stringify({ inline_keyboard: data })
    }
    const imageUrl = getdata.metadata.image || "https://telegra.ph/file/a41e47f544ed99dd33783.jpg" // Fallback image URL
    await bot.sendPhoto(chatId, imageUrl, options)
    await bot.deleteMessage(chatId, load.message_id)
  } catch (err) {
    console.error("Error in getPlaylistSpotify:", err)
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getPlaylistSpotify()\n• Url: ${url}\n\n${err.message}`.trim());
    return bot.editMessageText("Error getting playlist data!", { chat_id: chatId, message_id: load.message_id })
  }
}

async function getAlbumsSpotify(bot, chatId, url, userName) {
  let pars = await parse(url)
  let load = await bot.sendMessage(chatId, "Loading, please wait.")
  try {
    let getdata = await spotifyScraper(`${pars.id}`, "trackList/album")

    if (getdata.error) {
      throw new Error(getdata.error)
    }

    let data = []
    getdata.trackList.map((maru) => {
      data.push([{ text: `${maru.title} - ${maru.artists}`, callback_data: "spt " + maru.id }])
    })
    let options = {
      caption: "Please select the music you want to download by pressing one of the buttons below!",
      reply_markup: JSON.stringify({ inline_keyboard: data })
    }
    const imageUrl = getdata.metadata.image || "https://telegra.ph/file/a41e47f544ed99dd33783.jpg" // Fallback image URL
    await bot.sendPhoto(chatId, imageUrl, options)
    await bot.deleteMessage(chatId, load.message_id)
  } catch (err) {
    console.error("Error in getAlbumsSpotify:", err)
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getAlbumsSpotify()\n• Url: ${url}\n\n${err.message}`.trim());
    return bot.editMessageText("Error getting album data!", { chat_id: chatId, message_id: load.message_id })
  }
}

async function getSpotifySong(bot, chatId, url, userName) {
  let load = await bot.sendMessage(chatId, "Loading, please wait.")
  try {
    let pars = await parse(url)
    let getdata = await spotifyScraper(pars.id, "download")

    if (getdata.error) {
      throw new Error(getdata.error)
    }

    let fname = `${filterAlphanumericWithDash(getdata.metadata.title)}-${filterAlphanumericWithDash(getdata.metadata.artists)}_${chatId}.mp3`
    if (getdata.success) {
      await bot.editMessageText(`Downloading song ${getdata.metadata.title} - ${getdata.metadata.artists}, please wait...`, { chat_id: chatId, message_id: load.message_id })
      let buff = await getBuffer(getdata.link)
      await fs.writeFileSync("content/" + fname, buff)
      await bot.sendAudio(chatId, "content/" + fname, { caption: `Success download song ${getdata.metadata.title} - ${getdata.metadata.artists}` })
      await bot.deleteMessage(chatId, load.message_id)
      await fs.unlinkSync("content/" + fname)
    } else {
      await bot.editMessageText("Error, failed to get data", { chat_id: chatId, message_id: load.message_id })
    }
  } catch (err) {
    console.error("Error in getSpotifySong:", err)
    await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getSpotifySong()\n• Url: ${url}\n\n${err.message}`.trim());
    return bot.editMessageText("Failed to download song!", { chat_id: chatId, message_id: load.message_id })
  }
}

module.exports = {
  getPlaylistSpotify,
  getAlbumsSpotify,
  getSpotifySong,
}
