require('dotenv').config(); // For environment variables
const TelegramBot = require('node-telegram-bot-api');
const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');
const path = require('path');

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const ig = new IgApiClient(); // Initialize Instagram Client

let userCredentials = {}; // Temporarily store username and password

// Start Command for Telegram Bot
bot.onText(/\/priv/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome! Please enter your Instagram username:");
});

// Capture Instagram username
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    
    // If username hasn't been entered, prompt for password next
    if (!userCredentials.username) {
        userCredentials.username = msg.text;
        bot.sendMessage(chatId, 'Please enter your Instagram password:');
    } else if (!userCredentials.password) {
        userCredentials.password = msg.text;
        
        try {
            // Attempt to log in to Instagram
            await loginToInstagram(userCredentials.username, userCredentials.password);
            bot.sendMessage(chatId, 'Logged into Instagram successfully!');
            
            // Fetch and send user's story highlights, posts, etc.
            await sendUserMedia(chatId);
        } catch (error) {
            bot.sendMessage(chatId, 'Failed to log in to Instagram. Please try again.');
            console.error(error);
        }
    }
});

// Function to log in to Instagram
async function loginToInstagram(username, password) {
    ig.state.generateDevice(username); // Generate device for session

    const auth = await ig.account.login(username, password);
    console.log('Logged in successfully:', auth);
}

// Fetch and send media (posts, stories, etc.) to the user
async function sendUserMedia(chatId) {
    // Fetch user's stories, highlights, and posts using Instagram API
    const userId = await ig.user.getIdByUsername(userCredentials.username);
    
    // Example of getting user feed
    const userFeed = ig.feed.user(userId);
    const posts = await userFeed.items();
    
    // Download first post as an example
    for (let post of posts) {
        if (post.image_versions2) {
            const imageUrl = post.image_versions2.candidates[0].url;
            const fileName = `post_${post.id}.jpg`;

            await downloadImage(imageUrl, fileName);
            bot.sendPhoto(chatId, fileName);
        }
    }
    
    // Fetching more data like stories, highlights can be done similarly
}

// Function to download and save media
async function downloadImage(url, filename) {
    const axios = require('axios');
    const response = await axios({
        url,
        responseType: 'stream',
    });
    
    const writer = fs.createWriteStream(path.resolve(__dirname, filename));
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}




// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');

// const downloadInstagram = async (bot, chatId, url, username) => {
//   try {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     // Navigate to Instagram login page
//     await page.goto('https://www.instagram.com/accounts/login/');
//     await page.waitForSelector('input[name="username"]');

//     // Enter your Instagram login credentials
//     await page.type('input[name="username"]', process.env.IG_USERNAME);
//     await page.type('input[name="password"]', process.env.IG_PASSWORD);
//     await page.click('button[type="submit"]');

//     // Wait for navigation to the feed
//     await page.waitForNavigation();
//     await page.waitForTimeout(5000); // Wait for additional loading

//     // Navigate to the Instagram post URL
//     await page.goto(url);
//     await page.waitForSelector('img, video');

//     // Extract post content (image or video URL)
//     const mediaSrc = await page.evaluate(() => {
//       const mediaElement = document.querySelector('img, video');
//       return mediaElement ? mediaElement.src : null;
//     });

//     if (mediaSrc) {
//       const mediaBuffer = await page.goto(mediaSrc).then(res => res.buffer());
//       const fileName = path.basename(new URL(mediaSrc).pathname);
//       const filePath = path.join(__dirname, `../../downloads/${fileName}`);

//       // Save the media file
//       fs.writeFileSync(filePath, mediaBuffer);

//       // Send the file to the Telegram user
//       await bot.sendMessage(chatId, `Downloaded: ${fileName}`);
//       await bot.sendDocument(chatId, filePath);

//       // Delete the file after sending
//       fs.unlinkSync(filePath);
//     } else {
//       await bot.sendMessage(chatId, 'Failed to download the Instagram post.');
//     }

//     await browser.close();
//   } catch (error) {
//     console.error('Error downloading Instagram post:', error);
//     await bot.sendMessage(chatId, 'An error occurred while downloading the Instagram post.');
//   }
// };

// module.exports = {
//   downloadInstagram,
// };
