require('dotenv').config()
const axios = require('axios');
const { parse } = require('spotify-uri');
const util = require('util');
const { getBuffer, filterAlphanumericWithDash } = require('./functions');
const fs = require('fs');


const { exec } = require('child_process')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const DOWNLOAD_ROOT = path.resolve(__dirname, '..', 'downloads')

function getOutputDir() {
	const id = uuidv4()
	const dir = path.join(DOWNLOAD_ROOT, id)
	fs.mkdirSync(dir, { recursive: true })
	return dir
}

function getMP3Files(dir) {
	return fs.readdirSync(dir).filter(file => file.endsWith('.mp3'))
}

async function sendMP3Files(bot, chatId, dir) {
	const files = getMP3Files(dir)
	if (!files.length) {
		await bot.sendMessage(chatId, 'No audio files found after download.')
		return
	}

	for (const file of files) {
		const filePath = path.join(dir, file)
		const stream = fs.createReadStream(filePath)
		await bot.sendAudio(chatId, stream, {
			title: path.basename(file, '.mp3'),
		}).catch(err => {
			console.log('Send error:', err)
			bot.sendMessage(chatId, 'Error sending audio.')
		})
	}

	// Cleanup
	fs.rmSync(dir, { recursive: true, force: true })
}

function runSpotDL(bot, chatId, url, typeText) {
	const outputDir = getOutputDir()
	const command = `spotdl "${url}" --output "${outputDir}/%(title)s.%(ext)s"`

	bot.sendMessage(chatId, `Downloading ${typeText} via spotDL...`)

	exec(command, async (error, stdout, stderr) => {
		if (error) {
			console.error(`spotDL error:`, error)
			await bot.sendMessage(chatId, `Failed to download ${typeText}.`)
			return
		}
		await sendMP3Files(bot, chatId, outputDir)
	})
}

// ─── Functions ───────────────────────────────────────────

function downloadTrackFromSpotify(bot, chatId, url) {
	runSpotDL(bot, chatId, url, 'track')
}

function downloadAlbumFromSpotify(bot, chatId, url) {
	runSpotDL(bot, chatId, url, 'album')
}

function downloadPlaylistFromSpotify(bot, chatId, url) {
	runSpotDL(bot, chatId, url, 'playlist')
}

module.exports = {
	downloadTrackFromSpotify,
	downloadAlbumFromSpotify,
	downloadPlaylistFromSpotify,
}

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
