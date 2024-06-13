const axios = require('axios');
const cheerio = require('cheerio');

// Define the extractPlaylistImage function
async function extractPlaylistImage(playlistUrl) {
    try {
        const response = await axios.get(playlistUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);

        // Extract the image URL from the playlist page
        const imageUrl = $('meta[property="og:image"]').attr('content');
        
        return imageUrl;
    } catch (error) {
        console.error('Error extracting playlist image:', error);
        throw error;
    }
}

// Define the spotifyScraper function
async function spotifyScraper(id, endpoint) {
    try {
        let { data } = await axios.get(
            `https://api.spotifydown.com/${endpoint}/${id}`,
            {
                headers: {
                    Origin: 'https://spotifydown.com',
                    Referer: 'https://spotifydown.com/',
                }
            }
        );
        return data;
    } catch (err) {
        return 'Error: ' + err;
    }
}



// Example function to get playlist data and send the image
async function getPlaylistSpotify(bot, chatId, url, userName) {
    let pars = parse(url); // Assuming parse function exists to parse Spotify URL
    let load = await bot.sendMessage(chatId, "Loading, please wait.");
    try {
        let getdata = await spotifyScraper(`${pars.id}`, "trackList/playlist");
        let data = getdata.trackList.map(maru => [{ text: `${maru.title} - ${maru.artists}`, callback_data: "spt " + maru.id }]);

        let imageUrl = await extractPlaylistImage(url); // Get the playlist image URL
        let options = {
            caption: "Please select the music you want to download by pressing one of the buttons below!",
            reply_markup: JSON.stringify({ inline_keyboard: data })
        };
        await bot.sendPhoto(chatId, imageUrl, options); // Use the extracted image URL
        await bot.deleteMessage(chatId, load.message_id);
    } catch (err) {
        await bot.sendMessage(String(process.env.DEV_ID), `[ ERROR MESSAGE ]\n\n• Username: @${userName}\n• File: funcs/spotify.js\n• Function: getPlaylistSpotify()\n• Url: ${url}\n\n${err}`.trim());
        return bot.editMessageText("Error getting playlist data!", { chat_id: chatId, message_id: load.message_id });
    }
}


// Export the functions
module.exports = {
    extractPlaylistImage,
    spotifyScraper,
    getPlaylistSpotify,
};
