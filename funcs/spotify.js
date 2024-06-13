const axios = require('axios');
const cheerio = require('cheerio');

async function extractPlaylistImage(url) {
  try {
    const response = await axios.get(url);
    const htmlContent = response.data;
    const $ = cheerio.load(htmlContent);
    
    // Extract playlist cover image URL
    const imageUrl = $('meta[property="og:image"]').attr('content');
    
    return imageUrl;
  } catch (error) {
    console.error('Error extracting playlist image:', error);
    return null;
  }
}


// Call function to handle the Spotify playlist URL
handleSpotifyLink(spotifyPlaylistUrl);
