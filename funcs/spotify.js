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

// Example usage
async function handleSpotifyLink(url) {
  const imageUrl = await extractPlaylistImage(url);
  
  if (imageUrl) {
    // Send the image to the user (implementation depends on your messaging platform API)
    console.log('Sending image to user:', imageUrl);
    // Example: sendImageToUser(imageUrl);
  } else {
    console.log('Failed to extract playlist image.');
  }
}

// Example Spotify playlist URL
const spotifyPlaylistUrl = 'https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda';

// Call function to handle the Spotify playlist URL
handleSpotifyLink(spotifyPlaylistUrl);
