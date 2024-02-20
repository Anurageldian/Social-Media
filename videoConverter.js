require('dotenv').config();
const ffmpeg = require('fluent-ffmpeg');

// Function to convert video to GIF using ffmpeg
async function convertVideoToGif(videoPath) {
  return new Promise((resolve, reject) => {
    const gifPath = './images/output.gif';

    ffmpeg(videoPath)
      .inputFormat('mp4') // Change this based on the input video format
      .output(gifPath)
      .on('end', () => {
        console.log('Conversion finished');
        resolve(gifPath);
      })
      .on('error', (err) => {
        console.error('Error:', err);
        reject(err);
      })
      .run();
  });
}

module.exports = { convertVideoToGif };
