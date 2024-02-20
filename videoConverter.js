const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config(); // Load environment variables from .env file

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token from the .env file
const token = process.env.BOT_TOKEN;


// Listen for incoming messages
bot.onText(/\/convert/, (msg) => {
  const chatId = msg.chat.id;

  // Check if the message is a video
  if (msg.video) {
    const videoId = msg.video.file_id;

    // Get the file path for the video
    bot.getFile(videoId).then((videoFile) => {
      const videoFilePath = `https://api.telegram.org/file/bot${token}/${videoFile.file_path}`;

      // Convert the video to GIF using ffmpeg
      convertVideoToGif(videoFilePath, async (gifPath) => {
        // Send the GIF to the chat
        await bot.sendAnimation(chatId, gifPath, { caption: 'Video converted to GIF' });
        
        // Optionally, you can delete the generated GIF file after sending
        await fs.unlink(gifPath);
      });
    });
  }
});

// Function to convert video to GIF using ffmpeg
async function convertVideoToGif(videoPath, callback) {
  const outputFolderPath = __dirname; // Save in the same directory as the script
  const gifFileName = `output_${Date.now()}.gif`; // Unique filename

  const gifPath = path.join(outputFolderPath, gifFileName);

  ffmpeg(videoPath)
    .inputFormat('mp4') // Change this based on the input video format
    .output(gifPath)
    .on('end', () => {
      console.log('Conversion finished');
      callback(gifPath);
    })
    .on('error', (err) => {
      console.error('Error:', err);
    })
    .run();
}
