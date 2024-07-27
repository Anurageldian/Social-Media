require('dotenv').config()
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const util = require('util');
const cheerio = require('cheerio');

async function generateInstantViewUrl(url) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;

    // Fetch the HTML content of the URL
    const res = await fetch(url, { headers: { 'User-Agent': 'Web/2.0' } });
    const body = await res.text();
    const $ = cheerio.load(body);

    // Extract required metadata for Instant View
    let title = $('meta[property="og:title"]').attr('content') || $('title').text();
    let description = $('meta[property="og:description"]').attr('content');
    let imageUrl = $('meta[property="og:image"]').attr('content');
    let siteName = $('meta[property="og:site_name"]').attr('content') || url;

    // Construct the Instant View URL
    // Note: Replace YOUR_TELEGRAM_RHASH with your actual rhash value
    let instantViewUrl = `https://t.me/iv?url=${encodeURIComponent(url)}&rhash=34`;

    return {
      title,
      description,
      imageUrl,
      siteName,
      instantViewUrl
    };
  } catch (error) {
    console.error('Error generating Instant View URL:', error);
    throw error;
  }
}

module.exports = { generateInstantViewUrl };
