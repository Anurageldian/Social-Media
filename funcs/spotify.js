


require('dotenv').config()
const axios = require('axios');
const { parse } = require('spotify-uri');
const util = require('util');
const { getBuffer, filterAlphanumericWithDash } = require('./functions');
const fs = require('fs');


function isUrl(url) {
  return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi))
}

function tags2(title, artist, year, album, image) {
  const result = {
    title: title,
    artist: artist,
    year: year,
    album: album,
    image: {
      description: "Front Cover",
      imageBuffer: image
    }
  }
  return result
}

function tags(title, artist, year, album, image, track) {
  const result = {
    title: title,
    artist: artist,
    year: year,
    album: album,
    image: {
      description: "Front cover",
      imageBuffer: image
    },
    track: track
  }
  return result
}

function convertMs(duration) {
  var seconds = parseInt((duration / 1000) % 60)
  var minutes = parseInt((duration / (1000 * 60)) % 60)
  var hours = parseInt((duration / (1000 * 60 * 60)) % 24)
  hours = hours < 10 ? "0" + hours : hours
  minutes = minutes < 10 ? "0" + minutes : minutes
  seconds = seconds < 10 ? "0" + seconds : seconds
  return hours + ":" + minutes + ":" + seconds
}


const nodeID3 = require("node-id3")
const cheerio = require("cheerio")
const fetch = require("node-fetch")
const spot = require("@nechlophomeriaa/spotify-finder")
const spotify = new spot({
  consumer: {
    key: "d76e16244bb14150ababcfa7145bd278",
    secret: "13e2931fd8754722a5e8b7d140787eb0"
  }
})

const options = {
  headers: {
    Origin: "https://spotifydown.com",
    Referer: "https://spotifydown.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
  }
}

const options2 = {
  headers: {
    Referer: "https:/spotifydownloaders.com/",
    "if-none-match": "r72zw3bevk1du",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
  }
}

async function getOriginalUrl(url) {
  const data = await fetch(url)
  return data.url
}

/**
 *
 * @param {String} url
 * @returns {Promise<ArrayBuffer>}
 */
async function downloads2(url) {
  if (!isUrl(url)) throw new Error("Please input URL")
  if (url.includes("spotify.link")) {
    const originalUrl = await getOriginalUrl(url)
    const track = await fetch(`https://spotifydownloaders.com/api/spotify?url=${url}`, options2).then((res) => res.buffer())
    return track
  } else if (url.includes("open.spotify.com")) {
    const track = await fetch(`https://spotifydownloaders.com/api/spotify?url=${url}`, options2).then((res) => res.buffer())
    return track
  } else {
    const result = {
      status: false,
      message: "Please input valid spotify url"
    }
    console.log(result)
    return result
  }
}

async function downloads(url) {
  if (!isUrl(url)) throw new Error("Please input Url")
  if (url.includes("spotify.link")) {
    const originalUrl = await getOriginalUrl(url)
    const track = await axios.get(`https://api.spotifydown.com/metadata/track/${originalUrl.split("track/")[1].split("?")[0]}`, options)
    const { data } = await axios.get(`https://api.spotifydown.com/download/${track.data.id}`, options)
    const audioUrl = await fetch(data.link).then((res) => res.buffer())
    const imgUrl = await fetch(data.metadata.cover).then((res) => res.buffer())
    const writeTags = tags2(data.metadata.title, data.metadata.artists, data.metadata.releaseDate, data.metadata.album, imgUrl)
    const audioBuffer = await nodeID3.write(writeTags, audioUrl)
    const result = {
      success: data.success,
      metadata: data.metadata,
      audioBuffer: audioBuffer
    }
    return result
  } else if (url.includes("open.spotify.com")) {
    const { data } = await axios.get(`https://api.spotifydown.com/download/${url.split("track/")[1].split("?")[0]}`, options)
    const audioUrl = await fetch(data.link).then((res) => res.buffer())
    const imgUrl = await fetch(data.metadata.cover).then((res) => res.buffer())
    const writeTags = tags2(data.metadata.title, data.metadata.artists, data.metadata.releaseDate, data.metadata.album, imgUrl)
    const audioBuffer = await nodeID3.write(writeTags, audioUrl)
    const result = {
      success: data.success,
      metadata: data.metadata,
      audioBuffer: audioBuffer
    }
    return result
  } else {
    const result = {
      status: false,
      message: "Please input valid spotify url"
    }
    console.log(result)
    return result
  }
}

async function search(query, limit) {
  if (isUrl(query)) throw new Error("Search function not support for url")
  const limits = limit ? limit : 1
  const data = await spotify.search({ q: query, type: "track", limit: limits })
  return data.tracks
}

async function downloadAlbum2(url) {
  let result = {}
  if (!isUrl(url)) throw new Error("Please input an url")
  try {
    if (url.includes("spotify.link")) {
      var urll = await getOriginalUrl(url)
    } else if (url.includes("open.spotify.com")) {
      var urll = url
    } else {
      throw new Error("Invalid Url!")
    }
    if (!urll.includes("album/") && !urll.includes("playlist/")) throw new Error("Invalid album/playlist url")
    if (urll.includes("album/")) {
      var inputData = "album"
    } else {
      var inputData = "playlist"
    }
    const metadata = await spotify.getAlbum(urll)
    if (inputData === "album") {
      var inputArt = metadata.artists.map((s) => s.name)
      var inputArtists = inputArt.join(", ")
    }
    if (inputData === "playlist") {
      var inputArtists = metadata.owner.display_name
    }
    result = {
      type: inputData,
      metadata: {
        title: metadata.name,
        artists: inputArtists,
        cover: metadata.images[0].url,
        releaseDate: metadata.release_date ? metadata.release_date : undefined
      },
      trackList: []
    }
    const trackDetails = await axios.get(`https://spotifydownloaders.com/api/getSpotifyDetails?url=${urll}`, options2).then((res) => res.data)
    console.log(`Downloading audio...`)
    console.log("Please wait for a moment, this process will take for a couple minutes")
    for (let i = 0; i < trackDetails.tracks.length; i++) {
      const audioMp3 = await downloads2(`https://open.spotify.com/track/${trackDetails.tracks[i].uri.split("track:")[1]}`)
      result.trackList.push({
        success: true,
        metadata: trackDetails.tracks[i],
        audioBuffer: audioMp3
      })
    }
    return result
  } catch (err) {
    console.log(err)
    return String(err)
  }
}

async function downloadAlbum(url) {
  let result = { type: null, metadata: {}, trackList: [] }
  if (!isUrl(url)) throw new Error("Input Url")
  try {
    if (url.includes("spotify.link")) {
      const getOrigin = await getOriginalUrl(url)
      if (!getOrigin.includes("album/") && !getOrigin.includes("playlist/")) throw new Error("Invalid album/playlist url")
      if (getOrigin.includes("album/")) {
        var inputData = "album/"
      } else {
        var inputData = "playlist/"
      }
      const metaData = await axios.get(`https://api.spotifydown.com/metadata/${inputData}${getOrigin.split(inputData)[1].split("?")[0]}`, options)
      result.type = inputData.split("/")[0]
      result.metadata = metaData.data
      const { data } = await axios.get(`https://api.spotifydown.com/trackList/${inputData}${getOrigin.split(inputData)[1].split("?")[0]}`, options)
      console.log(`Downloading audio...`)
      console.log("Please wait for a moment, this process will take for a couple minutes")
      for (let i = 0; i < data.trackList.length; i++) {
        const downloading = await downloads(`https://open.spotify.com/track/${data.trackList[i].id}`)
        result.trackList.push(downloading)
      }
      return result
    } else if (url.includes("open.spotify.com")) {
      if (!url.includes("album/") && !url.includes("playlist/")) throw new Error("Invalid album/playlist url")
      if (url.includes("album/")) {
        var inputData = "album/"
      } else {
        var inputData = "playlist/"
      }
      const metaData = await axios.get(`https://api.spotifydown.com/metadata/${inputData}${url.split(inputData)[1].split("?")[0]}`, options)
      result.type = inputData.split("/")[0]
      result.metadata = metaData.data
      const { data } = await axios.get(`https://api.spotifydown.com/trackList/${inputData}${url.split(inputData)[1].split("?")[0]}`, options)
      console.log("Downloading audio...")
      console.log("Please wait for a moment, this process will take for a couple minutes")
      for (let i = 0; i < data.trackList.length; i++) {
        const downloading = await downloads(`https://open.spotify.com/track/${data.trackList[i].id}`)
        result.trackList.push(downloading)
      }
      return result
    } else {
      throw new Error("Invalid Url!")
    }
  } catch (err) {
    console.log(err)
    return String(err)
  }
}

async function downloadTrack2(song) {
  let result = {}
  if (isUrl(song)) {
    try {
      if (song.includes("spotify.link")) {
        const dataSong = await getOriginalUrl(song)
        if (!dataSong.includes("track")) {
          ;(result.status = false), (result.message = "Download track not support for Album/Playlist")
          console.log(result)
          return result
        }
        var tracks = await spotify.getTrack(dataSong.split("track/")[1].split("?")[0])
      } else if (song.includes("open.spotify.com")) {
        var tracks = await spotify.getTrack(song.split("track/")[1].split("?")[0])
      } else {
        throw new Error("Invalid Url!")
      }
      const downloadData = await downloads2(song)
      result = {
        status: true,
        title: tracks.name,
        artists: tracks.artists.map((art) => art.name).join(", "),
        duration: convertMs(tracks.duration_ms),
        duration_ms: tracks.duration_ms,
        explicit: tracks.explicit,
        popularity: tracks.popularity,
        url: tracks.external_urls.spotify,
        album: {
          name: tracks.album.name,
          type: tracks.album.album_type,
          tracks: tracks.album.total_tracks,
          releasedDate: tracks.album.release_date
        },
        imageUrl: tracks.album.images[0].url,
        audioBuffer: downloadData
      }
      return result
    } catch (err) {
      result = {
        status: false,
        message: "Unknown error occurred!\n\n" + String(err)
      }
      console.log(err)
      return result
    }
  } else {
    try {
      const searchTrack = await search(song, 1)
      const downloadData = await downloads2(searchTrack.items[0].external_urls.spotify)
      result = {
        status: true,
        title: searchTrack.items[0].name,
        artists: searchTrack.items[0].artists.map((art) => art.name).join(", "),
        duration: convertMs(searchTrack.items[0].duration_ms),
        duration_ms: searchTrack.items[0].duration_ms,
        explicit: searchTrack.items[0].explicit,
        popularity: searchTrack.items[0].popularity,
        url: searchTrack.items[0].external_urls.spotify,
        album: {
          name: searchTrack.items[0].album.name,
          type: searchTrack.items[0].album.album_type,
          tracks: searchTrack.items[0].album.total_tracks,
          releasedDate: searchTrack.items[0].album.release_date
        },
        imageUrl: searchTrack.items[0].album.images[0].url,
        audioBuffer: downloadData
      }
      return result
    } catch (err) {
      result = {
        status: false,
        message: "Unknown error occurred!\n\n" + String(err)
      }
      console.log(result)
      return result
    }
  }
}

async function downloadTrack(song) {
  let result = {}
  if (isUrl(song)) {
    try {
      if (song.includes("spotify.link")) {
        const getOrigin = await getOriginalUrl(song)
        if (!getOrigin.includes("track/")) {
          ;(result.status = false), (result.message = "Download track not support for Album/Playlist")
          console.log(result)
          return result
        }
        var tracks = await spotify.getTrack(getOrigin.split("track/")[1].split("?")[0])
      } else {
        var tracks = await spotify.getTrack(song.split("track/")[1].split("?")[0])
      }
      const downloadData = await downloads(song)
      result = {
        status: true,
        title: tracks.name,
        artists: tracks.artists.map((art) => art.name).join(", "),
        duration: convertMs(tracks.duration_ms),
        duration_ms: tracks.duration_ms,
        explicit: tracks.explicit,
        popularity: tracks.popularity,
        url: tracks.external_urls.spotify,
        album: {
          name: tracks.album.name,
          type: tracks.album.album_type,
          tracks: tracks.album.total_tracks,
          releasedDate: tracks.album.release_date
        },
        imageUrl: tracks.album.images[0].url,
        audioBuffer: downloadData.audioBuffer
      }
      return result
    } catch (err) {
      result = {
        status: false,
        message: "Unknown error occurred!\n\n" + String(err)
      }
      console.log(err)
      return result
    }
  } else {
    try {
      const searchTrack = await search(song, 1)
      const downloadData = await downloads(searchTrack.items[0].external_urls.spotify)
      result = {
        status: true,
        title: searchTrack.items[0].name,
        artists: searchTrack.items[0].artists.map((art) => art.name).join(", "),
        duration: convertMs(searchTrack.items[0].duration_ms),
        duration_ms: searchTrack.items[0].duration_ms,
        explicit: searchTrack.items[0].explicit,
        popularity: searchTrack.items[0].popularity,
        url: searchTrack.items[0].external_urls.spotify,
        album: {
          name: searchTrack.items[0].album.name,
          type: searchTrack.items[0].album.album_type,
          tracks: searchTrack.items[0].album.total_tracks,
          releasedDate: searchTrack.items[0].album.release_date
        },
        imageUrl: downloadData.metadata.cover,
        audioBuffer: downloadData.audioBuffer
      }
      return result
    } catch (err) {
      result = {
        status: false,
        message: "Unknown error occurred!\n\n" + String(err)
      }
      console.log(result)
      return result
    }
  }
}

module.exports = {
  isUrl,
  tags,
  convertMs,
  tags2,
  getOriginalUrl,
  search,
  downloads,
  downloadTrack,
  downloadAlbum,
  downloads2,
  downloadAlbum2,
  downloadTrack2
}
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

// async function spotifyScraper(id, endpoint) {
//   var myHeaders = new Headers();
// myHeaders.append("apikey", "Ap4iv4tWyxevIVeX0DMW5W4b7G8YHI1h");

// var requestOptions = {
//   method: 'GET',
//   redirect: 'follow',
//   headers: myHeaders
// };
//   try {
//     let { data } = await axios.get(`https://api.apilayer.com/spotify/${endpoint}?id=${id}`, requestOptions)
//     return data
//   } catch (err) {
//     return 'Error: ' + err
//   }
// }

// async function getPlaylistSpotify(bot, chatId, url, userName) {
//   let pars = await parse(url);
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.')
//   try {
//     let getdata = await spotifyScraper(`${pars.id}`, 'trackList/playlist')
//     let data = [];
//     getdata.trackList.map(maru => {
//       data.push([{ text: `${maru.title} - ${maru.artists}`, callback_data: 'spt ' + maru.id }])
//     })
//     let options = {
//       caption: 'Please select the music you want to download by pressing one of the buttons below!',
//       reply_markup: JSON.stringify({
//         inline_keyboard: data
//       })
//     };
//     await bot.sendPhoto(chatId, 'https://telegra.ph/file/a41e47f544ed99dd33783.jpg', options);
//     await bot.deleteMessage(chatId, load.message_id);
//   } catch (err) {
//     await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getPlaylistSpotify()\n• Url: ${url}\n\n${err}`.trim());
//     return bot.editMessageText('Error getting playlist data!', { chat_id: chatId, message_id: load.message_id })
//   }
// }

// async function getAlbumsSpotify(bot, chatId, url, userName) {
//   let pars = await parse(url);
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.')
//   try {
//     let getdata = await spotifyScraper(`${pars.id}`, 'trackList/album')
//     let data = [];
//     getdata.trackList.map(maru => {
//       data.push([{ text: `${maru.title} - ${maru.artists}`, callback_data: 'spt ' + maru.id }])
//     })
//     let options = {
//       caption: 'Please select the music you want to download by pressing one of the buttons below!',
//       reply_markup: JSON.stringify({
//         inline_keyboard: data
//       })
//     };
//     await bot.sendPhoto(chatId, 'https://telegra.ph/file/a41e47f544ed99dd33783.jpg', options);
//     await bot.deleteMessage(chatId, load.message_id);
//   } catch (err) {
//     await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getAlbumsSpotify()\n• Url: ${url}\n\n${err}`.trim());
//     return bot.editMessageText('Error getting playlist data!', { chat_id: chatId, message_id: load.message_id })
//   }
// }

// async function getSpotifySong(bot, chatId, url, userName) {
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.')
//   try {
//     if (url.includes('spotify.com')) {
//       let pars = await parse(url);
//       let getdata = await spotifyScraper(pars.id, 'download');
//       let fname = `${filterAlphanumericWithDash(getdata.metadata.title)}-${filterAlphanumericWithDash(getdata.metadata.artists)}_${chatId}.mp3`
//       if (getdata.success) {
//         await bot.editMessageText(`Downloading song ${getdata.metadata.title} - ${getdata.metadata.artists}, please wait...`, { chat_id: chatId, message_id: load.message_id })
//         let buff = await getBuffer(getdata.link);
//         await fs.writeFileSync('content/'+fname, buff);
//         await bot.sendAudio(chatId, 'content/'+fname, { caption: `Success download song ${getdata.metadata.title} - ${getdata.metadata.artists}`});
//         await bot.deleteMessage(chatId, load.message_id);
//         await fs.unlinkSync('content/'+fname);
//       } else {
//         await bot.editMessageText('Error, failed to get data', { chat_id: chatId, message_id: load.message_id })
//       }
//     } else {
//       let getdata = await spotifyScraper(url, 'download');
//       let fname = `${filterAlphanumericWithDash(getdata.metadata.title)}-${filterAlphanumericWithDash(getdata.metadata.artists)}_${chatId}.mp3`
//       if (getdata.success) {
//         await bot.editMessageText(`Downloading song ${getdata.metadata.title} - ${getdata.metadata.artists}, please wait...`, { chat_id: chatId, message_id: load.message_id })
//         let buff = await getBuffer(getdata.link);
//         await fs.writeFileSync('content/'+fname, buff);
//         await bot.sendAudio(chatId, 'content/'+fname, { caption: `Success download song ${getdata.metadata.title} - ${getdata.metadata.artists}`});
//         await bot.deleteMessage(chatId, load.message_id);
//         await fs.unlinkSync('content/'+fname);
//       } else {
//         await bot.editMessageText('Error, failed to get data', { chat_id: chatId, message_id: load.message_id })
//       }
//     }
//   } catch (err) {
//     await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getSpotifySong()\n• Url: ${url}\n\n${err}`.trim());
//     return bot.editMessageText('Failed to download song!', { chat_id: chatId, message_id: load.message_id })
//   }
// }

// module.exports = {
//   getPlaylistSpotify,
//   getAlbumsSpotify,
//   getSpotifySong
// }
