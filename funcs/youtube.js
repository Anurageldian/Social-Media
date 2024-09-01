const fs = require('fs')
const ytdl = require('ytdl-core')

async function downloadFromYoutube(bot, chatId, url) {
	try {
		// Get video information and thumbnail URL
		const videoInfo = await ytdl.getInfo(url).catch((err) => {
			bot
				.sendMessage(chatId, 'Error getting video information.')
				.catch((err) => {
					console.log(err)
				})
			console.log(err)
		})

		const title = videoInfo.player_response.videoDetails.title
		const thumbnailUrl =
			videoInfo.videoDetails.thumbnails[
				videoInfo.videoDetails.thumbnails.length - 1
			].url
		// Send a message to show the download progress
		await bot
			.sendMessage(chatId, `*Downloading video:* ${title}`)
			.catch((err) => {
				console.log(err)
			})

		// Create a writable stream to store the video file
		const writeStream = fs.createWriteStream(`content/${title}-${chatId}.mp4`)

		// Start the download and pipe the video data to the writable stream
		ytdl(url, { filter: 'audioandvideo' }).pipe(writeStream)

		// When the download is complete, send the video and delete the file
		writeStream.on('finish', () => {
			bot
				.sendVideo(
					chatId,
					`content/${title}-${chatId}.mp4`,
					{
						caption: `*Video downloaded:* ${title} "by" @Excalizan`,
						thumb: thumbnailUrl,
						duration: videoInfo.videoDetails.lengthSeconds,
						parse_mode: 'Markdown',
					},
					{
						filename: `content/${title}-${chatId}.mp4`,
						contentType: 'video/mp4',
					}
				)
				.catch((err) => {
					bot.sendMessage(chatId, 'Error sending video.').catch((err) => {
						console.log(err)
					})
					console.log(err)
				})

				.then(() => {
					try {
						fs.unlinkSync(`content/${title}-${chatId}.mp4`) // delete the file
					} catch (error) {
						console.error(error)
					}
				})
				.catch((error) => {
					bot.sendMessage(chatId, 'Error sending video.').catch((err) => {
						console.log(err)
					})
					console.error(error)
				})
		})
	} catch (error) {
		bot.sendMessage(chatId, 'Error downloading video.').catch((err) => {
			console.log(err)
		})
		console.error(error)
	}
}

module.exports = { downloadFromYoutube }

// require('dotenv').config();
// const fs = require('fs');
// const util = require('util');
// const { exec } = require('child_process');
// const { htmlToText, getBuffer, filterAlphanumericWithDash } = require('./functions');
// const execPromise = util.promisify(exec);
// const fetch = async () => {
//   const { default: fetch } = await import('node-fetch');
//   return fetch;
// };

// const logChannelId = process.env.LOGC_ID;

// async function downloadFromYouTube(url, format, outputFile) {
//   try {
//     const { stdout, stderr } = await execPromise(`yt-dlp -f ${format} -o ${outputFile} ${url}`);
//     if (stderr) {
//       throw new Error(stderr);
//     }
//     console.log(stdout);
//   } catch (error) {
//     console.error('Error downloading video:', error);
//     throw error;
//   }
// }

// async function getYoutube(bot, chatId, url, userName) {
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.');
//   try {
//     let format = 'bestaudio/best'; // or adjust for video
//     let outputFile = 'content/output.mp3'; // Change as needed

//     await downloadFromYouTube(url, format, outputFile);

//     await bot.sendAudio(chatId, outputFile, { caption: 'Successful music download' });
//     await bot.sendAudio(logChannelId, outputFile, { caption: 'Successful music download' });
//     await bot.deleteMessage(chatId, load.message_id);
//     fs.unlinkSync(outputFile);
//   } catch (err) {
//     console.error('Error in getYoutube:', err);
//     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutube()\n• Url: ${url}\n\n${err}`.trim());
//     return bot.editMessageText('An error occurred, make sure your YouTube link is valid!', { chat_id: chatId, message_id: load.message_id });
//   }
// }

// async function getYoutubeVideo(bot, chatId, id, ind, userName) {
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.');
//   try {
//     let url = `https://www.youtube.com/watch?v=${id}`;
//     let format = `bestvideo[height<=?720]` // Adjust format as needed
//     let outputFile = 'content/output.mp4';

//     await downloadFromYouTube(url, format, outputFile);

//     await bot.sendVideo(chatId, outputFile, { caption: 'Successful video download' });
//     await bot.sendVideo(logChannelId, outputFile, { caption: 'Successful video download' });
//     await bot.deleteMessage(chatId, load.message_id);
//     fs.unlinkSync(outputFile);
//   } catch (err) {
//     console.error('Error in getYoutubeVideo:', err);
//     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeVideo()\n• Url: https://www.youtube.com/${id}\n\n${err}`.trim());
//     return bot.editMessageText('An error occurred, failed to download video!', { chat_id: chatId, message_id: load.message_id });
//   }
// }

// async function getYoutubeAudio(bot, chatId, id, ind, userName) {
//   let load = await bot.sendMessage(chatId, 'Loading, please wait.');
//   try {
//     let url = `https://www.youtube.com/watch?v=${id}`;
//     let format = `bestaudio/best`;
//     let outputFile = 'content/output.mp3';

//     await downloadFromYouTube(url, format, outputFile);

//     await bot.sendAudio(chatId, outputFile, { caption: 'Successful audio download' });
//     await bot.sendAudio(logChannelId, outputFile, { caption: 'Successful audio download' });
//     await bot.deleteMessage(chatId, load.message_id);
//     fs.unlinkSync(outputFile);
//   } catch (err) {
//     console.error('Error in getYoutubeAudio:', err);
//     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeAudio()\n• Url: https://www.youtube.com/${id}\n\n${err}`.trim());
//     return bot.editMessageText('An error occurred, failed to download audio!', { chat_id: chatId, message_id: load.message_id });
//   }
// }

// module.exports = {
//   getYoutube,
//   getYoutubeVideo,
//   getYoutubeAudio
// }

// // require('dotenv').config();
// // const axios = require('axios');
// // const fs = require('fs');
// // const util = require('util');
// // const { htmlToText, getBuffer, filterAlphanumericWithDash } = require('./functions');
// // const { Y2MateClient } = require('y2mate-api');
// // const client = new Y2MateClient();
// // const logChannelId = process.env.LOGC_ID;

// // async function getYoutube(bot, chatId, url, userName) {
// //   let load = await bot.sendMessage(chatId, 'Loading, please wait.');
// //   let data = [];
// //   try {
// //     let newUrl = url.includes('music.youtube.com') ? url.replace('music.youtube.com', 'www.youtube.com') : url;
// //     let get = await client.getFromURL(newUrl, 'vi');
    
// //     console.log('get response:', get); // Debugging line

// //     if (!get || !get.linksAudio) {
// //       throw new Error('Invalid response from API.');
// //     }
    
// //     let audioFormat = get.linksAudio.get('mp3128') || get.linksAudio.get('140');
// //     if (!audioFormat) {
// //       throw new Error('Audio format not found.');
// //     }

// //     let getsize = audioFormat.size;
// //     let size = Math.floor(getsize.replace(' MB', ''));
// //     if (size > 49) {
// //       return bot.editMessageText('The file size is more than 50 MB, bots can only download under 50 MB.', { chat_id: chatId, message_id: load.message_id });
// //     }

// //     let fname = filterAlphanumericWithDash(get.title) + '.mp3';
// //     let get2 = await audioFormat.fetch();
// //     let buff = await getBuffer(get2.downloadLink);
// //     fs.writeFileSync('content/' + fname, buff);
// //     await bot.editMessageText(`Downloading music ${get.title}, please wait.`, { chat_id: chatId, message_id: load.message_id });
// //     await bot.sendAudio(chatId, 'content/' + fname, { caption: 'Successful music download ' + get.title });
// //     await bot.sendAudio(logChannelId, 'content/' + fname, { caption: 'Successful music download ' + get.title });
// //     await bot.deleteMessage(chatId, load.message_id);
// //     fs.unlinkSync('content/' + fname);
// //   } catch (err) {
// //     console.error('Error in getYoutube:', err); // Debugging line
// //     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutube()\n• Url: ${url}\n\n${err}`.trim());
// //     return bot.editMessageText('An error occurred, make sure your YouTube link is valid!', { chat_id: chatId, message_id: load.message_id });
// //   }
// // }

// // async function getYoutubeVideo(bot, chatId, id, ind, userName) {
// //   let load = await bot.sendMessage(chatId, 'Loading, please wait.');
// //   try {
// //     let get = await client.getFromURL('https://www.youtube.com/' + id, 'vi');
    
// //     console.log('get response:', get); // Debugging line

// //     if (!get || !get.linksVideo || !get.linksVideo.get(ind)) {
// //       throw new Error('Video format not found.');
// //     }

// //     let res = await get.linksVideo.get(ind).fetch();
// //     let getsize = get.linksVideo.get(ind).size;
// //     let size = Math.floor(getsize.replace(' MB', ''));
// //     if (size > 49) {
// //       return bot.editMessageText('File size is more than 50 MB, the bot can only download files under 50 MB. Please download it in your browser using the following link\n\n' + res.downloadLink, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true });
// //     }

// //     let fname = filterAlphanumericWithDash(res.title) + '.mp4';
// //     let buff = await getBuffer(res.downloadLink);
// //     fs.writeFileSync('content/' + fname, buff);
// //     await bot.editMessageText('Loading, downloading video ' + get.title, { chat_id: chatId, message_id: load.message_id });
// //     await bot.sendVideo(chatId, 'content/' + fname, { caption: res.title });
// //     await bot.sendVideo(logChannelId, 'content/' + fname, { caption: res.title });
// //     await bot.deleteMessage(chatId, load.message_id);
// //     fs.unlinkSync('content/' + fname);
// //   } catch (err) {
// //     console.error('Error in getYoutubeVideo:', err); // Debugging line
// //     await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeVideo()\n• Url: https://www.youtube.com/${id}\n\n${err}`.trim());
// //     return bot.editMessageText('An error occurred, failed to download video!', { chat_id: chatId, message_id: load.message_id });
// //   }
// // }

// // async function getYoutubeAudio(bot, chatId, id, ind, userName) {
// //   let load = await bot.sendMessage(chatId, 'Loading, please wait.');
// //   try {
// //     let get = await client.getFromURL('https://www.youtube.com/' + id, 'vi');
    
// //     console.log('get response:', get); // Debugging line

// //     if (!get || !get.linksAudio || !get.linksAudio.get(ind)) {
// //       throw new Error('Audio format not found.');
// //     }

// //     let res = await get.linksAudio.get(ind).fetch();
// //     let getsize = get.linksAudio.get(ind).size;
// //     let size = Math.floor(getsize.replace(' MB', ''));
// //     if (size > 49) {
// //       return bot.editMessageText('File size is more than 50 MB, the bot can only download files under 50 MB. Please download it in your browser using the following link\n\n' + res.downloadLink, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true });
// //     }

// //     let fname = filterAlphanumericWithDash(res.title) + '.mp3';
// //     let buff = await getBuffer(res.downloadLink);
// //     fs.writeFileSync('content/' + fname, buff);
// //     await bot.editMessageText('Loading, downloading audio ' + get.title, { chat_id: chatId, message_id: load.message_id });
// //     await bot.sendAudio(chatId, 'content/' + fname, { caption: res.title });
// //     await bot.sendAudio(logChannelId, 'content/' + fname, { caption: res.title });
// //     await bot.deleteMessage(chatId, load.message_id);
// //     fs.unlinkSync('content/' + fname);
// //   } catch (err) {
// //     console.error('Error in getYoutubeAudio:', err); // Debugging line
// //     await bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/youtube.js\n• Function: getYoutubeAudio()\n• Url: https://www.youtube.com/${id}\n\n${err}`.trim());
// //     return bot.editMessageText('An error occurred, failed to download audio!', { chat_id: chatId, message_id: load.message_id });
// //   }
// // }

// // module.exports = {
// //   getYoutube,
// //   getYoutubeVideo,
// //   getYoutubeAudio
// // };
