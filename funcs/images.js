require('dotenv').config();
let fs = require('fs');
const logChannelId = process.env.LOGC_ID;

let {
   TelegraPh,
   Pomf2Lain,
   ImageToText,
   EnhanceImage
} = require('./scraper_images.js');

async function telegraphUpload(bot, chatId, filePath, username) {
   let load = await bot.sendMessage(chatId, `Loading, please wait`)
   try {
      let upload = await TelegraPh(filePath);
      await bot.editMessageText(`Success upload to Telegraph\n${upload}`, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true });
      return fs.unlinkSync(filePath);
   } catch (err) {
      await bot.editMessageText(`Failed to upload image to telegraph`, { chat_id: chatId, message_id: load.message_id });
      return bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${username}\n• File: funcs/images.js\n• Function: telegraphUpload()\n• filePath: ${filePath}\n\n${err}`.trim());
   }
}

async function Pomf2Upload(bot, chatId, filePath, username) {
   let load = await bot.sendMessage(chatId, `Loading, please wait`)
   try {
      let upload = await Pomf2Lain(filePath);
      await bot.editMessageText(`Success upload to pomf2.lain.la\n${upload.files[0].url}`, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true });
      return fs.unlinkSync(filePath);
   } catch (err) {
      await bot.editMessageText(`Failed to upload image to pomf2.lain.la`, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true });
      return bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${username}\n• File: funcs/images.js\n• Function: Pomf2Upload()\n• filePath: ${filePath}\n\n${err}`.trim());
   }
}

async function Ocr(bot, chatId, filePath, username) {
   let load = await bot.sendMessage(chatId, `Loading, please wait`)
   try {
      let upload = await TelegraPh(filePath);
      await bot.editMessageText(`Uploading image, please wait`, { chat_id: chatId, message_id: load.message_id });
      let ocrbejir = await ImageToText(upload);
      await bot.editMessageText(ocrbejir, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true });
      return fs.unlinkSync(filePath);
   } catch (err) {
      await bot.editMessageText(`Failed to extract text in the image, make sure your image has text`, { chat_id: chatId, message_id: load.message_id, disable_web_page_preview: true });
      return bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${username}\n• File: funcs/images.js\n• Function: Ocr()\n• filePath: ${filePath}\n\n${err}`.trim());
   }
}

async function setGroupPhoto(bot, chatId, filePath, username, callbackQueryId) {
   try {
      const buffer = fs.readFileSync(filePath); // Read the photo file into a buffer
      await bot.setChatPhoto(chatId, buffer);
      await bot.answerCallbackQuery(callbackQueryId, { text: 'Group chat photo has been updated successfully!', show_alert: true });
      return fs.unlinkSync(filePath);
   } catch (error) {
      console.error('Error setting group chat photo:', error.message);
      await bot.answerCallbackQuery(callbackQueryId, { text: 'Failed to update group chat photo.', show_alert: true });
      return bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${username}\n• File: funcs/images.js\n• Function: setGroupPhoto()\n• filePath: ${filePath}\n\n${error}`.trim());
   }
}
async function setGCPic(bot, chatId, filePath) {
  try {
    // Check if the file exists before reading it
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    // Read the photo file into a buffer
    const buffer = fs.readFileSync(filePath);

    // Set the group chat photo using the buffer
    await bot.setChatPhoto(chatId, buffer);

    // Send a confirmation message
    await bot.sendMessage(chatId, 'Group chat photo has been updated successfully!');

    // Optionally delete the file after setting the photo
    fs.unlinkSync(filePath);

  } catch (error) {
    console.error('Error setting group chat photo:', error.message);
    bot.sendMessage(chatId, 'Failed to update group chat photo.');
    // You can send the error details to a log channel if needed
    bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n${error.message}`);
  }
}
// async function setGCPic(bot, chatId, filePath) {
//   try {
//     // Check if the file exists before reading it
//     // if (!fs.existsSync(filePath)) {
//     //   throw new Error(`File not found at path: ${filePath}`);
//     // }
//     // Read the photo file into a buffer
//     const buffer = fs.readFileSync(filePath);
//     // Set the group chat photo using the buffer
//     await bot.setChatPhoto(chatId, buffer);
//     // Send a confirmation message
//     await bot.sendMessage(chatId, 'Group chat photo has been updated successfully!');
//     // Optionally delete the file after setting the photo
//     return fs.unlinkSync(filePath);
//   } catch (error) {
//     console.error('Error setting group chat photo:', error.message);
//     bot.sendMessage(chatId, 'Failed to update group chat photo.');
//     // You can send the error details to a log channel if you need
//     bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n${error.message}`);
//   }
// }


module.exports = {
   telegraphUpload,
   Pomf2Upload,
   Ocr,
   setGroupPhoto,
   setGCPic
}
