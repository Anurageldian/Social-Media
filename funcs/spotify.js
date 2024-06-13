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

// Export the functions
module.exports = {
    extractPlaylistImage,
    spotifyScraper,
};
