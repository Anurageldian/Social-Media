const { Downloader } = require('spotify-downloader');

// Initialize the downloader
const downloader = new Downloader();

// Regex for Spotify Track
bot.onText(/(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.?com)\/track\/.+/, async (msg, match) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true });

    // Extract Spotify Track URL
    const trackUrl = match[0];
    const savePath = `./downloads/${msg.from.id}_track.mp3`; // Save path for the track

    // Download the track
    const track = await downloader.download(trackUrl);
    const trackStream = track.createStream();
    const fileStream = require('fs').createWriteStream(savePath);
    trackStream.pipe(fileStream);

    fileStream.on('finish', () => {
      bot.sendMessage(msg.chat.id, `Your Spotify track has been downloaded!`);
      bot.sendDocument(msg.chat.id, savePath);
    });

    fileStream.on('error', (err) => {
      bot.sendMessage(msg.chat.id, `Error downloading track: ${err.message}`);
    });
  } finally {
    userLocks[userId] = false;
  }
});

// Regex for Spotify Album
bot.onText(/(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.?com)\/album\/.+/, async (msg, match) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true });

    // Extract Spotify Album URL
    const albumUrl = match[0];
    const savePath = `./downloads/${msg.from.id}_album.zip`; // Save path for the album

    // Download the album (This requires handling multiple tracks in an album)
    const album = await downloader.download(albumUrl);
    const albumStream = album.createStream();
    const fileStream = require('fs').createWriteStream(savePath);
    albumStream.pipe(fileStream);

    fileStream.on('finish', () => {
      bot.sendMessage(msg.chat.id, `Your Spotify album has been downloaded!`);
      bot.sendDocument(msg.chat.id, savePath);
    });

    fileStream.on('error', (err) => {
      bot.sendMessage(msg.chat.id, `Error downloading album: ${err.message}`);
    });
  } finally {
    userLocks[userId] = false;
  }
});

// Regex for Spotify Playlist
bot.onText(/(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.?com)\/playlist\/.+/, async (msg, match) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true });

    // Extract Spotify Playlist URL
    const playlistUrl = match[0];
    const savePath = `./downloads/${msg.from.id}_playlist.zip`; // Save path for the playlist

    // Download the playlist (This requires handling multiple tracks in a playlist)
    const playlist = await downloader.download(playlistUrl);
    const playlistStream = playlist.createStream();
    const fileStream = require('fs').createWriteStream(savePath);
    playlistStream.pipe(fileStream);

    fileStream.on('finish', () => {
      bot.sendMessage(msg.chat.id, `Your Spotify playlist has been downloaded!`);
      bot.sendDocument(msg.chat.id, savePath);
    });

    fileStream.on('error', (err) => {
      bot.sendMessage(msg.chat.id, `Error downloading playlist: ${err.message}`);
    });
  } finally {
    userLocks[userId] = false;
  }
});

// require('dotenv').config()
// const axios = require('axios');
// const { parse } = require('spotify-uri');
// const util = require('util');
// const { getBuffer, filterAlphanumericWithDash } = require('./functions');
// const fs = require('fs');

// /*
// ** Endpoints **
// https://api.spotifydown.com

// * Download Song
// /download/

// * Metadata Playlist
// /metadata/playlist/

// * Track Playlist
// /trackList/playlist/

// */

// async function spotifyScraper(id, endpoint) {
//   try {
//     let { data } = await axios.get(`https://api.spotifydown.com/${endpoint}/${id}`, {
//       headers: {
//         'Origin': 'https://spotifydown.com',
//         'Referer': 'https://spotifydown.com/',
//       }
//     })
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
// require('dotenv').config()
// const axios = require('axios');
// const { parse } = require('spotify-uri');
// const util = require('util');
// const { getBuffer, filterAlphanumericWithDash } = require('./functions');
// const fs = require('fs');
// const logChannelId = process.env.LOGC_ID;


// /*
// ** Endpoints **
// https://api.spotifydown.com

// * Download Song
// /download/

// * Metadata Playlist
// /metadata/playlist/

// * Track Playlist
// /trackList/playlist/

// */

// async function spotifyScraper(id, endpoint) {
//   try {
//     let { data } = await axios.get(`https://api.spotifydown.com/${endpoint}/${id}`, {
//       headers: {
//         'Origin': 'https://spotifydown.com',
//         'Referer': 'https://spotifydown.com/',
//       }
//     })
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
//     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getPlaylistSpotify()\n• Url: ${url}\n\n${err}`.trim());
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
//     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getAlbumsSpotify()\n• Url: ${url}\n\n${err}`.trim());
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
//         await bot.sendAudio(logChannelId, 'content/'+fname, { caption: `Success download song ${getdata.metadata.title} - ${getdata.metadata.artists}`});
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
//         await bot.sendAudio(logChannelId, 'content/'+fname, { caption: `Success download song ${getdata.metadata.title} - ${getdata.metadata.artists}`});
//         await bot.deleteMessage(chatId, load.message_id);
//         await fs.unlinkSync('content/'+fname);
//       } else {
//         await bot.editMessageText('Error, failed to get data', { chat_id: chatId, message_id: load.message_id })
//       }
//     }
//   } catch (err) {
//     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getSpotifySong()\n• Url: ${url}\n\n${err}`.trim());
//     return bot.editMessageText('Failed to download song!', { chat_id: chatId, message_id: load.message_id })
//   }
// }

// module.exports = {
//   getPlaylistSpotify,
//   getAlbumsSpotify,
//   getSpotifySong
// }
