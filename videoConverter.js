const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config(); // Load environment variables from .env file




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
