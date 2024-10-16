require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { IgApiClient } = require('instagram-private-api');
const axios = require('axios');

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const ig = new IgApiClient();

let userCredentials = {}; // Store user credentials temporarily
let targetMemePage = '';  // Store the target private meme page

// Start Command
bot.onText(/\/priv/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome! Please enter your Instagram username:");
});

// Listen for username and password
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    // Capture Instagram username
    if (!userCredentials.username) {
        userCredentials.username = msg.text;
        bot.sendMessage(chatId, 'Please enter your Instagram password:');
    }
    // Capture Instagram password
    else if (!userCredentials.password) {
        userCredentials.password = msg.text;
        bot.sendMessage(chatId, 'Please enter the username of the private meme page you follow:');
    }
    // Capture target meme page username
    else if (!targetMemePage) {
        targetMemePage = msg.text;

        try {
            // Log into Instagram
            await loginToInstagram(userCredentials.username, userCredentials.password);
            bot.sendMessage(chatId, `Logged into Instagram successfully! Now fetching content from @${targetMemePage}...`);

            // Fetch and send target meme page media directly to Telegram
            await fetchTargetPageMedia(chatId, targetMemePage);
        } catch (error) {
            bot.sendMessage(chatId, 'Failed to log in to Instagram or fetch the media. Please try again.');
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

// Fetch and send target page's media (posts, stories, etc.)
async function fetchTargetPageMedia(chatId, targetMemePage) {
    try {
        // Get the target page's user ID
        const targetUserId = await ig.user.getIdByUsername(targetMemePage);

        // Get target page posts (for example, you can also fetch stories)
        const userFeed = ig.feed.user(targetUserId);
        const posts = await userFeed.items();

        // Loop through and send the media directly to the user on Telegram
        for (let post of posts) {
            if (post.image_versions2) {
                const imageUrl = post.image_versions2.candidates[0].url;

                // Send the image directly to the user's Telegram chat without saving
                await sendImageDirectlyToTelegram(chatId, imageUrl);
            } else if (post.video_versions) {
                const videoUrl = post.video_versions[0].url;

                // Send the video directly to the user's Telegram chat
                await sendVideoDirectlyToTelegram(chatId, videoUrl);
            }
        }

        bot.sendMessage(chatId, `Successfully sent content from @${targetMemePage}.`);
    } catch (error) {
        console.error('Error fetching media:', error);
        bot.sendMessage(chatId, 'Failed to fetch media from the target page.');
    }
}

// Send image directly to Telegram chat without saving locally
async function sendImageDirectlyToTelegram(chatId, imageUrl) {
    try {
        const response = await axios({
            url: imageUrl,
            responseType: 'arraybuffer' // Download as a binary stream to directly send to Telegram
        });

        const buffer = Buffer.from(response.data, 'binary');
        await bot.sendPhoto(chatId, buffer); // Send the image buffer to Telegram
    } catch (error) {
        console.error('Failed to send image:', error);
    }
}

// Send video directly to Telegram chat without saving locally
async function sendVideoDirectlyToTelegram(chatId, videoUrl) {
    try {
        const response = await axios({
            url: videoUrl,
            responseType: 'arraybuffer' // Download as a binary stream to directly send to Telegram
        });

        const buffer = Buffer.from(response.data, 'binary');
        await bot.sendVideo(chatId, buffer); // Send the video buffer to Telegram
    } catch (error) {
        console.error('Failed to send video:', error);
    }
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
