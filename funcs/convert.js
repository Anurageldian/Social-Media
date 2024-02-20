require('dotenv').config();
const { convertVideoToGif } = require('./ffmpegConverter'); // Import the function from the separate file

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Listen for incoming messages
bot.onText(/\/convert/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    // Check if the message is a video
    if (msg.video) {
      const videoId = msg.video.file_id;

      // Get the file path for the video
      const videoFile = await bot.getFile(videoId);
      const videoFilePath = `https://api.telegram.org/file/bot${token}/${videoFile.file_path}`;

      // Convert the video to GIF using ffmpeg
      const gifPath = await convertVideoToGif(videoFilePath);

      // Send the GIF to the chat
      await bot.sendAnimation(chatId, gifPath, { caption: 'Video converted to GIF' });
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle errors as needed
  }
});
