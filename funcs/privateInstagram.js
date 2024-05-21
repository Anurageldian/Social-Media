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
