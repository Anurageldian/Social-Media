require('dotenv').config()
const axios = require('axios');
const { parse } = require('spotify-uri');
const util = require('util');
const { getBuffer, filterAlphanumericWithDash } = require('./functions');
const fs = require('fs');


const Spotify = require('spotifydl-core').default

const cred = {
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
}

const spotify = new Spotify(cred)

async function downloadTrackFromSpotify(bot, chatId, url) {
	try {
		const data = await spotify.getTrack(url).catch((err) => {
			console.log(err)
		})

		if (!data) {
			await bot.sendMessage(chatId, 'Failed to retrieve track metadata')
			return
		}

		await bot.sendMessage(
			chatId,
			`Downloading track "${data.name}" by "${data.artists[0]}"`
		)

		let buffer = await spotify.downloadTrack(url).catch((err) => {
			console.log(err)
		})

		if (!buffer) {
			await bot.sendMessage(chatId, 'Retrying download...')
			buffer = await spotify.downloadTrack(url).catch((err) => {
				console.log(err)
			})
		}

		if (!buffer) {
			await bot.sendMessage(chatId, 'Failed to download the track')
			return
		}

		await bot.sendAudio(
			chatId,
			buffer,
			{
				title: data.name,
				performer: data.artists[0],
			},
			{
				filename: `${data.name}.mp3`,
				contentType: 'audio/mpeg',
			}
		)
	} catch (err) {
		console.log(err)
		await bot.sendMessage(chatId, 'Unexpected error occurred while downloading the track')
	}
}

async function downloadAlbumFromSpotify(bot, chatId, url) {
	try {
		const albumData = await spotify.getAlbum(url).catch((err) => {
			console.log(err)
		})

		if (!albumData) {
			await bot.sendMessage(chatId, 'Failed to retrieve album metadata')
			return
		}

		await bot.sendMessage(
			chatId,
			`Downloading album "${albumData.name}" with ${albumData.tracks.length} tracks...`
		)

		const buffer = await spotify.downloadAlbum(url).catch((err) => {
			console.log(err)
		})

		if (!buffer || buffer.length !== albumData.tracks.length) {
			await bot.sendMessage(chatId, 'Failed to download one or more tracks from the album')
			return
		}

		for (let i = 0; i < albumData.tracks.length; i++) {
			const track = albumData.tracks[i]

			const trackData = await spotify.getTrack(track).catch((err) => {
				console.log(err)
			})

			if (!trackData) continue

			await bot.sendAudio(
				chatId,
				buffer[i],
				{
					title: trackData.name,
					performer: trackData.artists[0],
				},
				{
					filename: `${trackData.name}.mp3`,
					contentType: 'audio/mpeg',
				}
			).catch((err) => {
				console.log(err)
				bot.sendMessage(chatId, `Error sending "${trackData.name}"`)
			})
		}
	} catch (err) {
		console.log(err)
		await bot.sendMessage(chatId, 'Unexpected error occurred while downloading the album')
	}
}

async function downloadPlaylistFromSpotify(bot, chatId, url) {
	try {
		const playlistData = await spotify.getPlaylist(url).catch((err) => {
			console.log(err)
		})

		if (!playlistData) {
			await bot.sendMessage(chatId, 'Failed to retrieve playlist metadata')
			return
		}

		await bot.sendMessage(
			chatId,
			`Downloading playlist "${playlistData.name}" with ${playlistData.tracks.length} tracks...`
		)

		const buffer = await spotify.downloadPlaylist(url).catch((err) => {
			console.log(err)
		})

		if (!buffer || buffer.length !== playlistData.tracks.length) {
			await bot.sendMessage(chatId, 'Failed to download one or more tracks from the playlist')
			return
		}

		for (let i = 0; i < playlistData.tracks.length; i++) {
			const track = playlistData.tracks[i]

			const trackData = await spotify.getTrack(track).catch((err) => {
				console.log(err)
			})

			if (!trackData) continue

			await bot.sendAudio(
				chatId,
				buffer[i],
				{
					title: trackData.name,
					performer: trackData.artists[0],
				},
				{
					filename: `${trackData.name}.mp3`,
					contentType: 'audio/mpeg',
				}
			).catch((err) => {
				console.log(err)
				bot.sendMessage(chatId, `Error sending "${trackData.name}"`)
			})
		}
	} catch (err) {
		console.log(err)
		await bot.sendMessage(chatId, 'Unexpected error occurred while downloading the playlist')
	}
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
