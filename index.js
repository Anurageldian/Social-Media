// /* required to disable the deprecation warning, 
will be fixed when node-telegram-bot-api gets a new update */
require('dotenv').config()
process.env['NTBA_FIX_350'] = 1
let express = require('express');
const { formatUptime } = require('./funcs/utils'); // Import the formatUptime function from utils.js
const os = require('os');
const { execSync } = require('child_process');
let app = express();
let TelegramBot = require('node-telegram-bot-api')
const { loadImage, createCanvas } = require('canvas');
let TelegramError = require('node-telegram-bot-api');
let fs = require('fs')
let fetch = import('node-fetch')
const path = require('path');
const https = require('https');
const request = require('request'); // Ensure request is imported here
const sharp = require('sharp');
let DEV_ID = process.env.DEV_ID;
let axios = require('axios')
let {
  getTiktokInfo,
  tiktokVideo,
  tiktokAudio,
  tiktokSound
} = require('./funcs/tiktok')
let {
  getDataTwitter,
  downloadTwitterHigh,
  downloadTwitterLow,
  downloadTwitterAudio
} = require('./funcs/twitter')
let {
 getPlaylistSpotify,
  getAlbumsSpotify,
  getSpotifySong
} = require('./funcs/spotify')
let {
  downloadInstagram
} = require('./funcs/instagram')
let {
  pinterest,
  pinSearch
} = require('./funcs/pinterest')
let {
  getBanned,
  blockUser,
  unblockUser
} = require('./funcs/functions')
let {
  getYoutube,
  getYoutubeAudio,
  getYoutubeVideo
} = require('./funcs/youtube')
let {
  getFacebook,
  getFacebookNormal,
  getFacebookHD,
  getFacebookAudio
} = require('./funcs/facebook')
let {
  threadsDownload
} = require('./funcs/threads')
let {
  getAiResponse
} = require('./funcs/ai')
let {
  getBrainlyAnswer
} = require('./funcs/brainly')
let {
  googleSearch
} = require('./funcs/google')
let {
  gitClone
} = require('./funcs/github')
let {
  getNetworkUploadSpeed,
  getNetworkDownloadSpeed,
  evaluateBot,
  executeBot,
} = require('./funcs/dev')
let {
  telegraphUpload,
  Pomf2Upload,
  Ocr,
  setGroupPhoto,
  setGCPic
} = require('./funcs/images');
let {
  readDb,
  writeDb,
  addUserDb,
  changeBoolDb
} = require('./funcs/database')
let userLocks = {};
let userLocksText = {};
let userLocksImage = {}
const logChannelId = process.env.LOGC_ID
let token = process.env.TOKEN
let bot = new TelegramBot(token, {
  polling: true
})
// Bot Settings
let botName = 'ɴᴇᴢᴜᴋᴏ ꜱᴏᴄɪᴀʟ ʙᴏᴛ';
app.get('/', async (req, res) => {
  res.send({
    Status: "Active"
  })
})

app.listen(5000, function () {});
console.log('Bot is running...')


bot.on('photo', async (msg) => {
  let chatId = msg.chat.id;
  let getban = await getBanned(chatId);
  if (!getban.status) return bot.sendMessage(chatId, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  if (!fs.existsSync(`images/${chatId}`)) await fs.mkdirSync(`images/${chatId}`)
  try {
    let write = await bot.downloadFile(msg.photo[msg.photo.length - 1].file_id, `images/${chatId}`);
    // await bot.deleteMessage(msg.chat.id, msg.message_id);
    // let options = {
    //   caption: `Please select the following option`,
    //   reply_markup: JSON.stringify({
      let  inlineKeyboard = [
          [{
            text: `Extract Text [ OCR ]`,
            callback_data: `ocr ${write}`
          }],
          [{
            text: `Upload To Url V1 [ Telegraph ]`,
            callback_data: `tourl1 ${write}`
          }],
          [{
            text: `Upload To Url V2 [ Pomf2 ]`,
            callback_data: `tourl2 ${write}`
          }]
        ];

    
          // Add the group photo option only if the chat is a group
    if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
      inlineKeyboard.push([{
        text: `Set as Group Photo`,
        callback_data: `setGroupPhoto ${write}`
      }]);
    }

    let options = {
      caption: `Please select an option:`,
      reply_markup: JSON.stringify({
        inline_keyboard: inlineKeyboard
      })
    };
    //       [{
    //         text: `Set as Group Photo`,
    //         callback_data: `setGroupPhoto ${write}`
    //       }]
    //     ]
    //   })
    // };
    return bot.sendPhoto(chatId, `${write}`, options)
  } catch (err) {
    return bot.sendMessage(logChannelId, `Error Image Process: ${err}`);
  }
});


// start
bot.onText(/\/start/, async (msg) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  
   // Fetch system uptime
  const uptimeSeconds = os.uptime();
  const formattedUptime = formatUptime(uptimeSeconds); // Use the formatUptime function from utils.js
// Get current date and time formatted as per your requirement
 let currentDate;
    try {
        currentDate = execSync('TZ="Asia/Kolkata" date +"%A, %B %d %Y, %I:%M %p"').toString().trim();
    } catch (error) {
        console.error('Error fetching current date:', error);
        currentDate = 'Date unavailable'; // Provide a fallback if date fetching fails
    }
 
  const inlineKeyboard = [
     [
        { text: 'Owner', url: 'https://t.me/firespower' }, // Add your social media link
      ],
    [
      { text: 'More >', callback_data: 'more_info' },
    ],
    
  ];
  
  let response = await bot.sendPhoto(msg.chat.id, 'https://telegra.ph/file/57fabcc59ac97735de40b.jpg', {
    caption:
`ʜᴇʟʟᴏ ɪ ᴀᴍ <b><i>${botName}</i></b>

ᴘʟᴇᴀꜱᴇ ꜱᴇɴᴅ ᴀ ʟɪɴᴋ ᴛᴏ ᴛʜᴇ ᴠɪᴅᴇᴏ ᴏʀ ᴘᴏꜱᴛ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ, ᴛʜᴇ ʙᴏᴛ ᴏɴʟʏ ꜱᴜᴘᴘᴏʀᴛꜱ ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ ᴏɴ ᴛʜᴇ ʟɪꜱᴛ

ʟɪꜱᴛ :
• <i>ᴛʜʀᴇᴀᴅꜱ</i>
• <i>ᴛɪᴋᴛᴏᴋ</i>
• <i>ɪɴꜱᴛᴀɢʀᴀᴍ</i>
• <i>ᴛᴡɪᴛᴛᴇʀ</i>
• <i>ꜰᴀᴄᴇʙᴏᴏᴋ</i>
• <i>ᴘɪɴᴛᴇʀᴇꜱᴛ</i>
• <i>ꜱᴘᴏᴛɪꜰʏ</i>
• <i>ɢɪᴛʜᴜʙ</i>\n
 ~~~~ ꜱʏꜱᴛᴇᴍ ᴜᴘᴛɪᴍᴇ: <code>${formattedUptime}</code> ~~~~ 
<code>${currentDate}</code> `,
    reply_markup: { inline_keyboard: inlineKeyboard },
    parse_mode: 'HTML', // Ensure Markdown mode is enabled
  });

  // Handle button callback
  bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;

    if (data === 'more_info') {
      // Send additional information when the button is pressed
      await bot.editMessageCaption(
        `ᴏᴛʜᴇʀ ꜰᴇᴀᴛᴜʀᴇꜱ
/ai (Qᴜᴇꜱᴛɪᴏɴ)
/brainly (ꜱᴏʟᴜᴛɪᴏɴ)
/pin (ꜱᴇᴀʀᴄʜɪɴɢ ᴘɪɴᴛᴇʀᴇꜱᴛ)
/google (ꜱᴇᴀʀᴄʜɪɴɢ ɢᴏᴏɢʟᴇ)

ꜱᴇɴᴅ ɪᴍᴀɢᴇꜱ, ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴜꜱᴇ ᴏᴄʀ (ᴇxᴛʀᴀᴄᴛ ᴛᴇxᴛ ᴏɴ ɪᴍᴀɢᴇ), ᴛᴇʟᴇɢʀᴀᴘʜ (ᴜᴘʟᴏᴀᴅ ᴛᴏ ᴛᴇʟᴇɢʀᴀᴘʜ), ᴀɴᴅ ᴘᴏᴍꜰ2 (ᴜᴘʟᴏᴀᴅ ᴛᴏ ᴘᴏᴍꜰ-2)\n
~~~ ꜱʏꜱᴛᴇᴍ ᴜᴘᴛɪᴍᴇ: <code>${formattedUptime}</code> ~~~ 
<code>${currentDate}</code> ~ `,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            inline_keyboard: [
              // Add the "Back to first caption" button
               [
        { text: 'Owner', url: 'https://t.me/firespower' }, // Add your social media link
      ],
              [{ text: '< Back', callback_data: 'back_to_first_caption' }],
            ],
          },
          parse_mode: 'HTML', // Ensure Markdown mode is enabled
        }
      );
    } else if (data === 'back_to_first_caption') {
      // Handle the callback for the "Back to first caption" button
      await bot.editMessageCaption(
`ʜᴇʟʟᴏ ɪ ᴀᴍ <b><i>${botName}</i></b>

ᴘʟᴇᴀꜱᴇ ꜱᴇɴᴅ ᴀ ʟɪɴᴋ ᴛᴏ ᴛʜᴇ ᴠɪᴅᴇᴏ ᴏʀ ᴘᴏꜱᴛ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ, ᴛʜᴇ ʙᴏᴛ ᴏɴʟʏ ꜱᴜᴘᴘᴏʀᴛꜱ ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ ᴏɴ ᴛʜᴇ ʟɪꜱᴛ

ʟɪꜱᴛ :
• <i>ᴛʜʀᴇᴀᴅꜱ</i>
• <i>ᴛɪᴋᴛᴏᴋ</i>
• <i>ɪɴꜱᴛᴀɢʀᴀᴍ</i>
• <i>ᴛᴡɪᴛᴛᴇʀ</i>
• <i>ꜰᴀᴄᴇʙᴏᴏᴋ</i>
• <i>ᴘɪɴᴛᴇʀᴇꜱᴛ</i>
• <i>ꜱᴘᴏᴛɪꜰʏ</i>
• <i>ɢɪᴛʜᴜʙ</i>\n
 ~~~~ ꜱʏꜱᴛᴇᴍ ᴜᴘᴛɪᴍᴇ: <code>${formattedUptime}</code> ~~~~ 
<code>${currentDate}</code> `,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: { inline_keyboard: inlineKeyboard },
          parse_mode: 'HTML', // Ensure Markdown mode is enabled
        }
      );
    }
  })

  let db = await readDb('./database.json');
  let chatId = msg.chat.id;
  if (!db[chatId]) {
    await addUserDb(chatId, './database.json');
    await bot.sendMessage(chatId, response);
    db = await readDb('./database.json');
  } else if (db[chatId]) {
    await bot.sendMessage(chatId, response);
  }
})

// !dev commands
// get network upload speed
bot.onText(/\/upload/, async (msg) => {
  let chatId = msg.chat.id
  if (String(msg.from.id) !== String(process.env.DEV_ID)) {
    return
  }
  await getNetworkUploadSpeed(bot, chatId)
})

// get network download speed
bot.onText(/\/download/, async (msg) => {
  let chatId = msg.chat.id
  // if user is not the developer
  if (String(msg.from.id) !== String(process.env.DEV_ID)) {
    return
  }
  await getNetworkDownloadSpeed(bot, chatId)
})

// send service settings
bot.onText(/\/sendssdb/, async (msg) => {
  if (String(msg.from.id) !== String(process.env.DEV_ID)) {
    return
  }
  await bot.sendDocument(msg.chat.id, "./serviceSettings.json")
})

// send database
bot.onText(/\/senddb/, async (msg) => {
  if (String(msg.from.id) !== String(process.env.DEV_ID)) {
    return
  }
  await bot.sendDocument(msg.chat.id, "./database.json")
})

//send banned users 
bot.onText(/\/lsban/, async (msg) => {
  if (String(msg.from.id) !== String(process.env.DEV_ID)) {
    return
  }
  await bot.sendDocument(msg.chat.id, "./funcs/banned.json")
})

// Evaluate Bot
bot.onText(/\>/, async (msg) => {
  if (String(msg.from.id) !== String(process.env.DEV_ID)) {
    return
  }
  let text = msg.text.split(' ').slice(1).join(' ');
  await evaluateBot(bot, msg.chat.id, text)
})

// Execute Bot
bot.onText(/\$/, async (msg) => {
  if (String(msg.from.id) !== String(process.env.DEV_ID)) {
    return
  }
  let text = msg.text.split(' ').slice(1).join(' ');
  await executeBot(bot, msg.chat.id, text)
})

// Gpt 3 / AI
bot.onText(/\/ai/, async (msg) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let input = msg.text.split(' ').slice(1).join(' ');
  let userId = msg.from.id.toString();
  if (userLocksText[userId]) {
    return;
  }
  userLocksText[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await getAiResponse(bot, msg.chat.id, input, msg.chat.username);
  } finally {
    userLocksText[userId] = false;
  }
})

// Google
bot.onText(/\/google/, async (msg) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let input = msg.text.split(' ').slice(1).join(' ');
  let userId = msg.from.id.toString();
  if (userLocksText[userId]) {
    return;
  }
  userLocksText[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await googleSearch(bot, msg.chat.id, input, msg.chat.username);
  } finally {
    userLocksText[userId] = false;
  }
})

// Brainly
bot.onText(/\/brainly/, async (msg) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let input = msg.text.split(' ').slice(1).join(' ');
  let userId = msg.from.id.toString();
  if (userLocksText[userId]) {
    return;
  }
  userLocksText[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await getBrainlyAnswer(bot, msg.chat.id, input, msg.chat.username);
  } finally {
    userLocksText[userId] = false;
  }
})

// Pinterest Search
bot.onText(/^(\/(pin|pinterest))/, async (msg) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let input = msg.text.split(' ').slice(1).join(' ');
  let userId = msg.from.id.toString();
  if (userLocksImage[userId]) {
    return;
  }
  userLocksImage[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await pinSearch(bot, msg.chat.id, input, msg.chat.username);
  } finally {
    userLocksImage[userId] = false;
  }
})

// Tiktok Regex
bot.onText(/https?:\/\/(?:.*\.)?tiktok\.com/, async (msg) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await getTiktokInfo(bot, msg.chat.id, msg.text, msg.chat.username);
  } finally {
    userLocks[userId] = false;
  }
})

// Twitter Regex
bot.onText(/https?:\/\/(?:.*\.)?(twitter\.com|x\.com)/, async (msg) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await getDataTwitter(bot, msg.chat.id, msg.text, msg.chat.username);
  } finally {
    userLocks[userId] = false;
  }
})

// Instagram Regex
bot.onText(/(https?:\/\/)?(www\.)?(instagram\.com)\/.+/, async (msg) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await downloadInstagram(bot, msg.chat.id, msg.text, msg.chat.username);
  } finally {
    userLocks[userId] = false;
  }
})

// Pinterest Regex
bot.onText(/(https?:\/\/)?(www\.)?(pinterest\.ca|pinterest\.?com|pin\.?it)\/.+/, async (msg) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await pinterest(bot, msg.chat.id, msg.text, msg.chat.username);
  } finally {
    userLocks[userId] = false;
  }
})

// Spotify Track Regex
bot.onText(/(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.?com)\/track\/.+/, async (msg, match) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await getSpotifySong(bot, msg.chat.id, match[0], msg.chat.username)
  } finally {
    userLocks[userId] = false;
  }
})

// Spotify Albums Regex
bot.onText(/(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.?com)\/album\/.+/, async (msg, match) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await getAlbumsSpotify(bot, msg.chat.id, match[0], msg.chat.username)
  } finally {
    userLocks[userId] = false;
  }
})

const { extractPlaylistImage, spotifyScraper } = require('./funcs/spotify'); // Ensure the path is correct

// Spotify Playlist Regex
bot.onText(/(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.?com)\/playlist\/.+/, async (msg, match) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await getPlaylistSpotify(bot, msg.chat.id, match[0], msg.chat.username)
  } finally {
    userLocks[userId] = false;
  }
})


// Youtube Regex
bot.onText(/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/, async (msg, match) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    if (match[0].includes("/live/")) return bot.sendMessage(msg.chat.id, `Cannot download livestream video`)
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await getYoutube(bot, msg.chat.id, match[0], msg.chat.username)
  } finally {
    userLocks[userId] = false;
  }
})

// Facebook Regex
bot.onText(/^https?:\/\/(www\.)?(m\.)?facebook\.com\/.+/, async (msg, match) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await getFacebook(bot, msg.chat.id, match[0], msg.chat.username)
  } finally {
    userLocks[userId] = false;
  }
})

// Threads Regex
bot.onText(/^https?:\/\/(www\.)?threads\.net\/.+/, async (msg, match) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await threadsDownload(bot, msg.chat.id, match[0], msg.chat.username)
  } finally {
    userLocks[userId] = false;
  }
})

// Github Clone Regex
bot.onText(/(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i, async (msg, match) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(logChannelId, `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await gitClone(bot, msg.chat.id, match[0], msg.chat.username)
  } finally {
    userLocks[userId] = false;
  }
})


// Listen for the /id command
bot.onText(/\/id/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Define the reply options
  const replyOptions = {
    reply_to_message_id: msg.message_id,
    parse_mode: 'HTML',
  };

  // Check if it's a reply to another message
  if (msg.reply_to_message) {
    const repliedUserId = msg.reply_to_message.from.id;
    const repliedUserName = msg.reply_to_message.from.first_name || 'Unknown User';

    // Construct the response for a reply to /id
    const rplyuser = `User <a href="tg://user?id=${repliedUserId}">${repliedUserName}</a>'s ID: <code>${repliedUserId}</code>\nYour User ID: <code>${userId}</code>\nThis Chat's ID: <code>${chatId}</code>`;
    bot.sendMessage(chatId, rplyuser, replyOptions);
  } else {
    // Check if it's a private chat
    if (msg.chat.type === 'private') {
      const myidpriv = `Your User ID: <code>${userId}</code>`;
      bot.sendMessage(chatId, myidpriv, replyOptions);  // Reply to the /id message itself
    } else {
      // If it's a group chat
      const usergc = `Your User ID: <code>${userId}</code>\nThis Chat's ID: <code>${chatId}</code>`;
      bot.sendMessage(chatId, usergc, replyOptions);
    }
  }
});



// //to generate user id in chat or private
// bot.onText(/\/id/, (msg) => {
//   const chatId = msg.chat.id;
//   const userId = msg.from.id;

//   // Check if the message is sent in a group or private chat
//   if (msg.chat.type === 'private') {
//     // Private chat: only show user ID
//     const myidpriv = `Your User ID: <code>${userId}</code>`;
//     bot.sendMessage(chatId, myidpriv, { parse_mode: 'HTML' });
//   } else {
//     // Group chat: Check if the message is a reply to another user
//     if (msg.reply_to_message) {
//       const repliedUserId = msg.reply_to_message.from.id;  // The ID of the user being replied to
//       const repliedUserName = msg.reply_to_message.from.first_name || 'Unknown User';

//       // Construct the reply message with replied user and IDs
//       const rplyuser = `User <a href="tg://user?id=${repliedUserId}">${repliedUserName}</a>'s ID: <code>${repliedUserId}</code>\nYour User ID: <code>${userId}</code>\nThis Chat's ID: <code>${chatId}</code>`;
//       bot.sendMessage(chatId, rplyuser, { parse_mode: 'HTML' });
//     } else {
//       // If not a reply, show only the user's and chat's ID
//       const usergc = `
//         Your User ID: <code>${userId}</code>\n
//         This Chat's ID: <code>${chatId}</code>
//       `;
//       bot.sendMessage(chatId, usergc, { parse_mode: 'HTML' });
//     }
//   }
// });


// Delete message command for everyone
bot.onText(/\/del/, async (msg) => {
  const chatId = msg.chat.id;
  const messageIdToDelete = msg.reply_to_message?.message_id;
  const userId = msg.from.id;

  // Ensure the command is a reply to another message
  if (!messageIdToDelete) {
    return bot.sendMessage(chatId, 'Please reply to the message you want to delete with the /del command.');
  }

  // Check if the user is the developer
  if (String(userId) === String(process.env.DEV_ID)) {
    try {
      // Attempt to delete the replied-to message
      await bot.deleteMessage(chatId, messageIdToDelete);
      // Optionally, delete the /del command message itself
      await bot.deleteMessage(chatId, msg.message_id);
    } catch (error) {
      console.error('Error deleting message:', error);
      bot.sendMessage(chatId, 'I was unable to delete the message. Ensure I have permission to delete messages.');
    }
    return;
  }

  // If the user is not the developer, check if they are an admin with delete rights
  try {
    const chatMember = await bot.getChatMember(chatId, userId);

    // Check if the user is an admin with can_delete_messages permission
    if (
      chatMember.status === 'administrator' &&
      chatMember.can_delete_messages
    ) {
      await bot.deleteMessage(chatId, messageIdToDelete);
      // Optionally, delete the /del command message itself
      await bot.deleteMessage(chatId, msg.message_id);
    } else {
      bot.sendMessage(chatId, 'You do not have permission to delete messages.');
    }
  } catch (error) {
    console.error('Error checking user permissions:', error);
    bot.sendMessage(chatId, 'I was unable to check your permissions.');
  }
});

// bot.onText(/\/del/, async (msg) => {
//   const chatId = msg.chat.id;
//   const messageIdToDelete = msg.reply_to_message?.message_id;

//   // Ensure the command is a reply to another message
//   if (!messageIdToDelete) {
//     return bot.sendMessage(chatId, 'Please reply to the message you want to delete with the /del command.');
//   }

//   try {
//     // Attempt to delete the replied-to message
//     await bot.deleteMessage(chatId, messageIdToDelete);
//     // Optionally, you can delete the /del command message itself to keep the chat clean
//     await bot.deleteMessage(chatId, msg.message_id);
//   } catch (error) {
//     console.error('Error deleting message:', error);
//     bot.sendMessage(chatId, 'I was unable to delete the message. Ensure I have permission to delete messages.');
//   }
// });

//purge 

// Command to purge messages OG
bot.onText(/\/purge/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Ensure the /purge command is a reply to another message
  if (!msg.reply_to_message) {
    return bot.sendMessage(chatId, "Please reply to the message you want to start purging from.");
  }

  // Get the starting message ID from the reply
  const purgeStartMessageId = msg.reply_to_message.message_id;

  // Check if the user is the developer or has the necessary permissions
  if (String(userId) === String(process.env.DEV_ID)) {
    // Developer can delete messages without admin rights
  } else {
    const user = await bot.getChatMember(chatId, userId);
    if (user.status !== 'administrator' && user.status !== 'creator') {
      return bot.sendMessage(chatId, "Only admins or the developer can use the /purge command.");
    }

    // Check if the user has 'can_delete_messages' permission
    if (!user.can_delete_messages) {
      return bot.sendMessage(chatId, "You do not have permission to delete messages.");
    }
  }

  // Initialize a counter for deleted messages
  let deletedCount = 0;

  // Loop through and delete messages starting from the replied message
  try {
    for (let messageId = purgeStartMessageId; messageId <= msg.message_id; messageId++) {
      try {
        // Attempt to delete each message
        await bot.deleteMessage(chatId, messageId);
        deletedCount++;
      } catch (error) {
        if (error.response && error.response.body && error.response.body.description.includes("message to delete not found")) {
          // Ignore error if message is already deleted
          continue;
        }
        console.error("Error deleting message:", error);
      }
    }
    
    // Confirm purge completion with the number of deleted messages
    bot.sendMessage(chatId, `I have purged ${deletedCount} messages.`);
  } catch (error) {
    console.error("Error during purge operation:", error);
    bot.sendMessage(chatId, "An error occurred while purging messages.");
  }
});


// bot.onText(/\/purge/, async (msg) => {
//   const chatId = msg.chat.id;
//   const purgeEndMessageId = msg.message_id;
//   const userId = msg.from.id;

//   // Ensure the /purge command is a reply to another message
//   if (!msg.reply_to_message) {
//     return bot.sendMessage(chatId, "Please reply to the message you want to start purging from.");
//   }

//   // Get the starting message ID from the reply
//   const purgeStartMessageId = msg.reply_to_message.message_id;

//   // Check if the user has admin privileges
//   const user = await bot.getChatMember(chatId, userId);
//   if (user.status !== 'administrator' && user.status !== 'creator') {
//     return bot.sendMessage(chatId, "Only admins can use the /purge command.");
//   }

//   // Initialize a counter for deleted messages
//   let deletedCount = 0;

//   // Purge messages from purgeStartMessageId to purgeEndMessageId
//   try {
//     for (let messageId = purgeStartMessageId; messageId <= purgeEndMessageId; messageId++) {
//       try {
//         // Attempt to delete each message
//         await bot.deleteMessage(chatId, messageId);
//         deletedCount++;
//       } catch (error) {
//         if (error.response && error.response.body && error.response.body.description.includes("message to delete not found")) {
//           // Ignore error if message is already deleted
//           continue;
//         }
//         console.error("Error deleting message:", error);
//       }
//     }
    
//     // Confirm purge completion with the number of deleted messages
//     bot.sendMessage(chatId, `I have purged ${deletedCount} messages.`);
//   } catch (error) {
//     console.error("Error during purge operation:", error);
//     bot.sendMessage(chatId, "An error occurred while purging messages.");
//   }
// });

// // Command to purge messages
// bot.onText(/\/purge/, async (msg) => {
//   const chatId = msg.chat.id;
//   const purgeEndMessageId = msg.message_id;
//   const userId = msg.from.id;

//   // Ensure the /purge command is a reply to another message
//   if (!msg.reply_to_message) {
//     return bot.sendMessage(chatId, "Please reply to the message you want to start purging from.");
//   }

//   // Get the starting message ID from the reply
//   const purgeStartMessageId = msg.reply_to_message.message_id;

//   // Check if the user has admin privileges
//   const user = await bot.getChatMember(chatId, userId);
//   if (user.status !== 'administrator' && user.status !== 'creator') {
//     return bot.sendMessage(chatId, "Only admins can use the /purge command.");
//   }

//   // Initialize a counter for deleted messages
//   let deletedCount = 0;

//   // Purge messages from purgeStartMessageId to purgeEndMessageId
//   try {
//     for (let messageId = purgeStartMessageId; messageId <= purgeEndMessageId; messageId++) {
//       try {
//         // Attempt to delete each message
//         await bot.deleteMessage(chatId, messageId);
//         deletedCount++;
//       } catch (error) {
//         if (error.response && error.response.body && error.response.body.description.includes("message to delete not found")) {
//           // Ignore error if message is already deleted
//           continue;
//         }
//         console.error("Error deleting message:", error);
//       }
//     }
    
//     // Confirm purge completion with the number of deleted messages
//     bot.sendMessage(chatId, `I have purged ${deletedCount} messages.`);
//   } catch (error) {
//     console.error("Error during purge operation:", error);
//     bot.sendMessage(chatId, "An error occurred while purging messages.");
//   }
// });

const serviceSettingsPath = path.join(__dirname, 'serviceSettings.json');
let serviceSettings = [];
// Load settings from JSON file
if (fs.existsSync(serviceSettingsPath)) {
  serviceSettings = JSON.parse(fs.readFileSync(serviceSettingsPath, 'utf8'));
}

// Helper function to save settings
function saveSettings() {
  fs.writeFileSync(serviceSettingsPath, JSON.stringify(serviceSettings, null, 2));
}

// Helper function to get the group service setting
function getGroupSetting(groupId) {
  return serviceSettings.find(item => item.groupid === groupId);
}

const allowedServices = ['all', 'join', 'leave', 'pin', 'title', 'videochat', 'off'];

// Command to add services to a group
bot.onText(/\/cleanservice ?(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const services = match[1].trim() ? match[1].trim().split(',').map(service => service.trim()) : [];

  // Check if user is an admin
  const user = await bot.getChatMember(chatId, userId);
  if (user.status !== 'administrator' && user.status !== 'creator') {
    return bot.sendMessage(chatId, 'Only admins can use this command.');
  }

  // If no service specified, list the current active services
  if (services.length === 0) {
    const groupSetting = getGroupSetting(chatId);
    const activeServices = groupSetting ? groupSetting.services.join(', ') : 'No services enabled';
    return bot.sendMessage(chatId, `Active services in this chat: ${activeServices}`);
  }

  // Get or create group service settings
  let groupSetting = getGroupSetting(chatId);
  if (!groupSetting) {
    groupSetting = { groupid: chatId, services: [] };
    serviceSettings.push(groupSetting);
  }

  // Handle the "off" command specifically
  if (services.includes('off')) {
    // Clear all other services and set only "off"
    groupSetting.services = ['off'];
    saveSettings();
    return bot.sendMessage(chatId, 'All services have been turned off for this group.');
  }

  // Remove "off" if other services are being activated
  const offIndex = groupSetting.services.indexOf('off');
  if (offIndex !== -1) {
    groupSetting.services.splice(offIndex, 1);
  }

  // Validate and add services
  for (const service of services) {
    if (!allowedServices.includes(service)) {
      return bot.sendMessage(chatId, `Invalid service: "${service}". Please use one of the following: ${allowedServices.join(', ')}`);
    }
    if (!groupSetting.services.includes(service)) {
      groupSetting.services.push(service);
    }
  }

  saveSettings();
  bot.sendMessage(chatId, `Added services: ${services.join(', ')} to this group.`);
});


// Command to remove services from a group
bot.onText(/\/removeservice ?(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const services = match[1].trim() ? match[1].trim().split(',').map(service => service.trim()) : [];

  // Check if user is an admin
  const user = await bot.getChatMember(chatId, userId);
  if (user.status !== 'administrator' && user.status !== 'creator') {
    return bot.sendMessage(chatId, 'Only admins can use this command.');
  }

  // If no service specified, list the current active services
  if (services.length === 0) {
    const groupSetting = getGroupSetting(chatId);
    const activeServices = groupSetting ? groupSetting.services.join(', ') : 'No services enabled';
    return bot.sendMessage(chatId, `Active services in this chat: ${activeServices}`);
  }

  // Validate services
  for (const service of services) {
    if (!allowedServices.includes(service)) {
      return bot.sendMessage(chatId, `Invalid service: "${service}". Please use one of the following: ${allowedServices.join(', ')}`);
    }
  }

  // Get group service settings
  let groupSetting = getGroupSetting(chatId);
  if (!groupSetting) {
    return bot.sendMessage(chatId, 'No services are set for this group.');
  }

  // Remove services from the group
  services.forEach(service => {
    const index = groupSetting.services.indexOf(service);
    if (index !== -1) {
      groupSetting.services.splice(index, 1);
    }
  });

  saveSettings();
  bot.sendMessage(chatId, `Removed services: ${services.join(', ')} from this group.`);
});

// Monitor and delete service messages based on settings
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const groupSetting = getGroupSetting(chatId);

  if (!groupSetting || groupSetting.services.includes('off')) return;

  // Conditions for each service message type
  const isJoinMessage = msg.new_chat_members;
  const isLeaveMessage = msg.left_chat_member;
  const isPinnedMessage = msg.pinned_message;
  const isTitleChange = msg.group_chat_created || msg.supergroup_chat_created || msg.migrate_to_chat_id || msg.migrate_from_chat_id || msg.new_chat_photo || msg.delete_chat_photo;
  const isVideoChatMessage = msg.video_chat_started || msg.video_chat_ended || msg.video_chat_scheduled || msg.video_chat_participants_invited;

  // Only delete service messages that match the group setting
  try {
    groupSetting.services.forEach(service => {
      if (
        service === 'all' ||
        (service === 'join' && isJoinMessage) ||
        (service === 'leave' && isLeaveMessage) ||
        (service === 'pin' && isPinnedMessage) ||
        (service === 'title' && isTitleChange) ||
        (service === 'videochat' && isVideoChatMessage)
      ) {
        if (
          (service === 'all' && (isJoinMessage || isLeaveMessage || isPinnedMessage || isTitleChange || isVideoChatMessage)) ||
          (service === 'join' && isJoinMessage) ||
          (service === 'leave' && isLeaveMessage) ||
          (service === 'pin' && isPinnedMessage) ||
          (service === 'title' && isTitleChange) ||
          (service === 'videochat' && isVideoChatMessage)
        ) {
          bot.deleteMessage(chatId, msg.message_id);
        }
      }
    });
  } catch (error) {
    console.error('Error deleting service message:', error);
  }
});

// /lock users

// Load settings from JSON file
if (fs.existsSync(serviceSettingsPath)) {
  serviceSettings = JSON.parse(fs.readFileSync(serviceSettingsPath, 'utf8'));
}

// Helper function to save settings
function saveSettings() {
  fs.writeFileSync(serviceSettingsPath, JSON.stringify(serviceSettings, null, 2));
}

// Helper function to get the group setting
function getGroupSetting(groupId) {
  return serviceSettings.find(item => item.groupid === groupId);
}

// Command to lock new users in a group
bot.onText(/\/lock users/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Check if the user is an admin
  const user = await bot.getChatMember(chatId, userId);
  if (user.status !== 'administrator' && user.status !== 'creator') {
    return bot.sendMessage(chatId, 'Only admins can use this command.');
  }

  // Enable user restriction for new members
  let groupSetting = getGroupSetting(chatId);
  if (!groupSetting) {
    groupSetting = { groupid: chatId, services: ['users'] };
    serviceSettings.push(groupSetting);
  } else {
    if (!groupSetting.services.includes('users')) {
      groupSetting.services.push('users');
    }
  }

  saveSettings();
  bot.sendMessage(chatId, 'New users will be muted until unmuted.');
});

// Command to unlock users, allowing them to chat
bot.onText(/\/unlock users/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Check if the user is an admin
  const user = await bot.getChatMember(chatId, userId);
  if (user.status !== 'administrator' && user.status !== 'creator') {
    return bot.sendMessage(chatId, 'Only admins can use this command.');
  }

  // Disable user restriction for new members
  let groupSetting = getGroupSetting(chatId);
  if (groupSetting && groupSetting.services.includes('users')) {
    groupSetting.services = groupSetting.services.filter(service => service !== 'users');
    saveSettings();
    bot.sendMessage(chatId, 'New users will no longer be muted.');
  }
});

// Listen to new members and restrict them if the 'users' service is enabled
bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;
  const groupSetting = getGroupSetting(chatId);

  if (groupSetting && groupSetting.services.includes('users')) {
    msg.new_chat_members.forEach((member) => {
      bot.restrictChatMember(chatId, member.id, {
        can_send_messages: true,
      });
      const permsg = `<a href="tg://user?id=${member.id}">${member.first_name}</a> 's perms has been limited by default until freed.`;
      bot.sendMessage(chatId, permsg, { parse_mode: 'HTML' });
    });
  }
});

// Command to unlock a specific user by admin
// Command to unlock a specific user by admin, either by replying to the user's message or using user ID
bot.onText(/\/free(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Check if the user is an admin
  const user = await bot.getChatMember(chatId, userId);
  if (user.status !== 'administrator' && user.status !== 'creator') {
    return bot.sendMessage(chatId, 'Only admins can use this command.');
  }

  let targetUserId;

  // Check if the bot is replying to a user message
  if (msg.reply_to_message) {
    targetUserId = msg.reply_to_message.from.id;  // Get the user ID of the person being replied to
  } else if (match[1]) {
    // If a user ID is provided in the command
    targetUserId = match[1];
  } else {
    // If neither is provided, let the admin know they need to reply to a message or provide a user ID
    return bot.sendMessage(chatId, 'Please reply to a user message or provide a user ID.');
  }

  // Unmute the user
  bot.restrictChatMember(chatId, targetUserId, {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
        can_change_info: true,
        can_invite_users: true,
        can_pin_messages: true
  });

  bot.sendMessage(chatId, `User ${targetUserId} has been unlocked.`);
});


// Helper function to load the current service settings on bot startup
// function loadServiceSettings() {
//   if (fs.existsSync(serviceSettingsPath)) {
//     serviceSettings = JSON.parse(fs.readFileSync(serviceSettingsPath, 'utf8'));
//   } else {
//     serviceSettings = [];
//   }
// }

// // Reload service settings when the bot starts
// loadServiceSettings();

// // Helper function to load the current service settings on bot startup
// function loadServiceSettings() {
//   if (fs.existsSync(serviceSettingsPath)) {
//     serviceSettings = JSON.parse(fs.readFileSync(serviceSettingsPath, 'utf8'));
//   } else {
//     serviceSettings = [];
//   }
// }


// const serviceSettingsPath = path.join(__dirname, 'serviceSettings.json');
// // Load settings from JSON file
// let serviceSettings = [];
// if (fs.existsSync(serviceSettingsPath)) {
//   serviceSettings = JSON.parse(fs.readFileSync(serviceSettingsPath, 'utf8'));
// }

// // Helper function to save settings
// function saveSettings() {
//   fs.writeFileSync(serviceSettingsPath, JSON.stringify(serviceSettings, null, 2));
// }

// // Helper function to get the group service setting
// function getGroupSetting(groupId) {
//   const group = serviceSettings.find(item => item.groupid === groupId);
//   return group ? group.service : null;
// }

// // Handle /cleanservice command
// bot.onText(/\/cleanservice (.+)/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const userId = msg.from.id;
//   const setting = match[1].trim().toLowerCase();
//   const allowedSettings = ['all', 'join', 'pin', 'title', 'videochat', 'off'];

//   // Check if user is an admin
//   const user = await bot.getChatMember(chatId, userId);
//   if (user.status !== 'administrator' && user.status !== 'creator') {
//     return bot.sendMessage(chatId, 'Only admins can use this command.');
//   }

//   if (!allowedSettings.includes(setting)) {
//     return bot.sendMessage(chatId, `Invalid setting. Please use one of the following: ${allowedSettings.join(', ')}`);
//   }

//   // Update or add setting for the group
//   const existingGroupSetting = serviceSettings.find(item => item.groupid === chatId);
//   if (existingGroupSetting) {
//     existingGroupSetting.service = setting;
//   } else {
//     serviceSettings.push({ groupid: chatId, service: setting });
//   }
//   saveSettings();
//   bot.sendMessage(chatId, `Service message cleaning set to "${setting}" for this group.`);
// });

// // Monitor and delete service messages based on settings
// bot.on('message', async (msg) => {
//   const chatId = msg.chat.id;
//   const setting = getGroupSetting(chatId);

//   if (!setting || setting === 'off') return;

//   // Conditions for each service message type
//   const isJoinMessage = msg.new_chat_members;
//   const isLeaveMessage = msg.left_chat_member;
//   const isPinnedMessage = msg.pinned_message;
//   const isTitleChange = msg.group_chat_created || msg.supergroup_chat_created || msg.migrate_to_chat_id || msg.migrate_from_chat_id;
//   const isVideoChatMessage = msg.video_chat_started || msg.video_chat_ended || msg.video_chat_scheduled || msg.video_chat_participants_invited;

//   try {
//     if (
//       (setting === 'all') ||
//       (setting === 'join' && isJoinMessage) ||
//       (setting === 'pin' && isPinnedMessage) ||
//       (setting === 'title' && isTitleChange) ||
//       (setting === 'videochat' && isVideoChatMessage)
//     ) {
//       if (!msg.photo) {
//         await bot.deleteMessage(chatId, msg.message_id);
//       }
//     }
//   } catch (error) {
//     console.error('Error deleting service message:', error);
//   }
// });

bot.onText(/\/setgcpic/, async (msg) => {
  const chatId = msg.chat.id;
  const issuerId = msg.from.id;

  // Ensure the command is a reply with a photo
  if (!msg.reply_to_message || !msg.reply_to_message.photo) {
    return bot.sendMessage(chatId, 'Please reply to a photo with the /setgcpic command to set it as the group profile picture.');
  }

  try {
    // Check if the issuer has permission to change group info
    const issuer = await bot.getChatMember(chatId, issuerId);
    if (issuer.status !== 'creator' && !issuer.can_change_info) {
      return bot.sendMessage(chatId, 'You need the "Change Group Info" permission to set the group profile picture.');
    }

    // Create the folder if it does not exist
    const folderPath = `imagesgcpic/${chatId}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Download the photo to the specified folder, letting the bot determine the filename
    const downloadedFilePath = await bot.downloadFile(
      msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1].file_id,
      folderPath
    );

    // Call the function to set the group photo using the downloaded file
    await setGCPic(bot, chatId, downloadedFilePath);

  } catch (error) {
    console.error('Error setting group profile picture:', error);
    bot.sendMessage(chatId, 'An error occurred while trying to set the group profile picture.');
  }
});

bot.onText(/\/rmgcpic/, async (msg) => {
  const chatId = msg.chat.id;
  const issuerId = msg.from.id;
  try {
    // Check if the issuer has permission to change group info
    const issuer = await bot.getChatMember(chatId, issuerId);
    if (issuer.status !== 'creator' && !issuer.can_change_info) {
      return bot.sendMessage(chatId, 'You need the "Change Group Info" permission to remove the group profile picture.');
    }
    // Check if the group has a profile picture
    const chat = await bot.getChat(chatId);
    if (!chat.photo) {
      return bot.sendMessage(chatId, 'No group picture found to remove.');
    }
    // Remove the group chat photo
    await bot.deleteChatPhoto(chatId);
    bot.sendMessage(chatId, 'Group chat photo has been removed successfully!');
  } catch (error) {
    console.error('Error removing group profile picture:', error);
    bot.sendMessage(chatId, 'An error occurred while trying to remove the group profile picture.');
  }
});

// async function setGroupPhoto(bot, chatId, filePath, username, callbackQueryId) {
//   try {
//     // Read the photo file into a buffer
//     const buffer = fs.readFileSync(filePath);

//     // Set the group chat photo using the buffer
//     await bot.setChatPhoto(chatId, buffer);
//     await bot.answerCallbackQuery(callbackQueryId, { text: 'Group chat photo has been updated successfully!', show_alert: true });

//     // Optionally delete the file after setting the photo
//     fs.unlinkSync(filePath);

//   } catch (error) {
//     console.error('Error setting group chat photo:', error.message);
//     await bot.answerCallbackQuery(callbackQueryId, { text: 'Failed to update group chat photo.', show_alert: true });
//     bot.sendMessage(logChannelId, `[ ERROR MESSAGE ]\n\n• Username: @${username}\n• Function: setGroupPhoto()\n\n${error.message}`);
//   }
// }


// bot.onText(/\/setgcpic/, async (msg) => {
//   const chatId = msg.chat.id;

//   // Ensure the command is a reply with a photo
//   if (!msg.reply_to_message || !msg.reply_to_message.photo) {
//     return bot.sendMessage(chatId, 'Please reply to a photo with the /setgcpic command to set it as the group profile picture.');
//   }

//   try {
//     // Check if the user has permission to change group info
//     const userId = msg.from?.id;
//     if (!userId) {
//       return bot.sendMessage(chatId, 'Error: User ID not found.');
//     }

//     const user = await bot.getChatMember(chatId, userId);
//     if (user.status !== 'administrator' && user.status !== 'creator') {
//       return bot.sendMessage(chatId, 'You need to be an admin to set the group profile picture.');
//     }

//     if (!user.can_change_info) {
//       return bot.sendMessage(chatId, 'You need the "Change Group Info" permission to set the group profile picture.');
//     }

//     // Check if the bot has permission to change group info
//     const botMember = await bot.getChatMember(chatId, bot.id);
//     if (botMember.status !== 'administrator' && botMember.status !== 'creator') {
//       return bot.sendMessage(chatId, 'The bot needs to be an admin to change the group profile picture.');
//     }

//     if (!botMember.can_change_info) {
//       return bot.sendMessage(chatId, 'The bot needs the "Change Group Info" permission to change the group profile picture.');
//     }

//     // Retrieve the highest quality version of the photo
//     const photo = msg.reply_to_message.photo.pop();
//     const fileId = photo.file_id;
//     const fileLink = await bot.getFileLink(fileId);
    
//     // Fetch the photo file and set as group picture
//     const response = await fetch(fileLink);
//     const buffer = await response.buffer();
//     await bot.setChatPhoto(chatId, { source: buffer });

//     bot.sendMessage(chatId, 'Group profile picture has been updated successfully!');
//   } catch (error) {
//     console.error('Error setting group profile picture:', error);
//     bot.sendMessage(chatId, 'An error occurred while trying to set the group profile picture.');
//   }
// });

// Command to set group profile picture
// bot.onText(/\/setgcpic/, async (msg) => {
//   const chatId = msg.chat.id;

//   // Ensure command is a reply and the message contains a photo
//   if (!msg.reply_to_message.photo) {
//     return;
//   }

//   try {
//     // Check if the user and bot are admins with "Change Group Info" permission
//     const userId = msg.from?.id;
//     if (!userId) {
//       return bot.sendMessage(chatId, 'Error: User ID not found.');
//     }

//     const user = await bot.getChatMember(chatId, userId);
//     if (!user || (user.status !== 'administrator' && user.status !== 'creator')) {
//       return bot.sendMessage(chatId, 'You need to be an admin to set the group profile picture.');
//     }

//     if (!user.can_change_info) {
//       return bot.sendMessage(chatId, 'You need the "Change Group Info" permission to set the group profile picture.');
//     }

//     const botMember = await bot.getChatMember(chatId, bot.id);
//     if (!botMember || (botMember.status !== 'administrator' && botMember.status !== 'creator')) {
//       return bot.sendMessage(chatId, 'The bot needs to be an admin to change the group profile picture.');
//     }

//     if (!botMember.can_change_info) {
//       return bot.sendMessage(chatId, 'The bot needs the "Change Group Info" permission to change the group profile picture.');
//     }

//     // Proceed to set the profile picture if all checks pass
//     const photo = msg.reply_to_message.photo.pop();
//     const fileId = photo.file_id;
//     const fileLink = await bot.getFileLink(fileId);
//     const response = await fetch(fileLink);
//     const buffer = await response.buffer();

//     const inputFile = { source: buffer, filename: 'group-profile-picture.jpg' };
//     await bot.setChatPhoto(chatId, inputFile);
//     bot.sendMessage(chatId, 'Group profile picture has been updated successfully!');
//   } catch (error) {
//     console.error('Error setting group profile picture:', error);
//     bot.sendMessage(chatId, 'An error occurred while trying to set the group profile picture.');
//   }
// });



// Function to fetch stickers based on search term and page number
async function fetchStickers(searchTerm, page) {
  try {
    const response = await axios.get(`https://combot.org/api/telegram/stickers?q=${encodeURIComponent(searchTerm)}&p=${page}`);
    
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to fetch stickers for "${searchTerm}" (Page ${page})`);
    }
  } catch (error) {
    console.error("Error fetching stickers:", error);
    throw new Error(`Failed to fetch stickers for "${searchTerm}" (Page ${page})`);
  }
}


const { generateInstantViewUrl } = require('./funcs/instantView');

// Command to generate Instant View URL
bot.onText(/\/iv (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1].trim();

  try {
    const result = await generateInstantViewUrl(url);
    const message = `
Title: ${result.title}
Description: ${result.description}
Image URL: ${result.imageUrl}
Site Name: ${result.siteName}
Instant View URL: ${result.instantViewUrl}`;
    await bot.sendMessage(chatId, message);
  } catch (err) {
    console.error('Error generating Instant View URL:', err);
    await bot.sendMessage(chatId, 'Failed to generate Instant View URL.');
  }
})

// /stickers command
bot.onText(/\/stickers (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const searchTerm = match[1];

  try {
    const stickers = await fetchStickers(searchTerm, currentPage);
    
    if (stickers && stickers.length > 0) {
      let stickerList = '';
      stickers.forEach((sticker, index) => {
        stickerList += `${index + 1 + ((currentPage - 1) * resultsPerPage)}. [${sticker.set_name}](${sticker.sticker_url})\n\n`;
      });

      // Pagination buttons
      const prevButton = currentPage > 1 ? '◀️ Previous' : '';
      const nextButton = stickers.length === resultsPerPage ? 'Next ▶️' : '';
      const pagination = `${prevButton}${prevButton && nextButton ? ' | ' : ''}${nextButton}`;

      bot.sendMessage(chatId, `Stickers found for "${searchTerm}" (Page ${currentPage}):\n\n${stickerList}${pagination}`, { parse_mode: 'Markdown' });
    } else {
      bot.sendMessage(chatId, `No stickers found for "${searchTerm}".`);
    }
  } catch (error) {
    bot.sendMessage(chatId, `Failed to fetch stickers for "${searchTerm}".`);
  }
});

// Command to handle next page
bot.onText(/Next ▶️/, async (msg) => {
  if (currentPage < 1000) { // Limiting to 1000 pages to avoid infinite pagination
    currentPage++;
    bot.emit('sticker-pagination', msg);
  }
});

// Command to handle previous page
bot.onText(/◀️ Previous/, async (msg) => {
  if (currentPage > 1) {
    currentPage--;
    bot.emit('sticker-pagination', msg);
  }
});

// Listen to the /block command
bot.onText(/\/block (\d+) (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const blockedUserId = match[1];  // The user ID to be blocked
  const reason = match[2];  // The reason for blocking

  // Check if the user issuing the command is the bot owner (DEV_ID)
  if (userId !== parseInt(DEV_ID)) {
    bot.sendMessage(msg.chat.id, 'You are not authorized to block users.');
    return;  // Stop further execution if not the bot owner
  }

  // Add the user to banned list
  await blockUser(blockedUserId, reason);

  // Send confirmation message
  bot.sendMessage(msg.chat.id, `User ${blockedUserId} has been blocked for reason: ${reason}`);
});


// Listen for commands
// bot.onText(/\/block (\d+) (.+)/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const userId = parseInt(match[1]);
//   const reason = match[2];

//   const result = await blockUser(userId, reason);
//   bot.sendMessage(chatId, result);
// });

bot.onText(/\/unblock (\d+)/, async (msg, match) => {
  const userId = msg.from.id;
  const unblockedUserId = match[1];  // The user ID to be unblocked

  // Check if the user issuing the command is the bot owner (DEV_ID)
  if (userId !== parseInt(DEV_ID)) {
    bot.sendMessage(msg.chat.id, 'You are not authorized to unblock users.');
    return;  // Stop further execution if not the bot owner
  }

  // Remove the user from banned list
  await unblockUser(unblockedUserId);

  // Send confirmation message
  bot.sendMessage(msg.chat.id, `User ${unblockedUserId} has been unblocked.`);
});

// Command: Ban User
// bot.onText(/\/ban (.+)/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const userIdToBan = match[1].trim();

//   const issuerId = msg.from.id;

//   try {
//     // Fetch the chat member status of the issuer
//     const issuer = await bot.getChatMember(chatId, issuerId);

//     // Fetch the chat member status of the bot
 
//     // Check if the issuer has the 'can_restrict_members' permission or is the chat creator
//     if (
//       issuer.status !== 'creator' &&
//       !issuer.can_restrict_members
//     ) {
//       bot.sendMessage(chatId, 'You need to have the "can restrict members" permission to ban users.');
//       return;
//     }
//     // Check if the bot has the 'can_restrict_members' permission
//     // if (!botMember.can_restrict_members) {
//     //   bot.sendMessage(chatId, 'The bot needs to have the "can restrict members" permission to ban users.');
//     //   return;
//     // }

//     // Ban the user
//     try {
//       await bot.banChatMember(chatId, userIdToBan);
//       bot.sendMessage(chatId, `User ${userIdToBan} has been banned.`);
//     } catch (error) {
//       console.error('Error banning user:', error.message);
//       bot.sendMessage(chatId, `Failed to ban user ${userIdToBan}.`);
//     }
//   } catch (error) {
//     console.error('Error handling /ban command:', error.message);
//     bot.sendMessage(chatId, 'An error occurred while processing the ban command.');
//   }
// });
bot.onText(/\/hey (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  {
  if (String(msg.from.id) !== String(process.env.DEV_ID)) {
    return
  }
  
      await bot.sendMessage(msg.chat.id, msg.reply_to_message, msg.from.id);
  }
});

//promote
bot.onText(/\/promote(?:\s+(\S+))?(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userIdOrUsernameToPromote = match[1] ? match[1].trim() : null;
  const customTitle = match[2] ? match[2].trim() : (msg.reply_to_message ? match[1] : '');  // Handle custom title in reply case
  const issuerId = msg.from.id;

  try {
    // Check if the command issuer has "can_promote_members" permission
    const issuer = await bot.getChatMember(chatId, issuerId);
    if (issuer.status !== 'administrator' && !issuer.can_promote_members) {
      bot.sendMessage(chatId, 'You need the "can promote members" permission to promote users.');
      return;
    }

    let userIdToPromote;
    let userToPromote;

    if (msg.reply_to_message) {
      // If the command is in reply to a message, use the ID of the message's author
      userIdToPromote = msg.reply_to_message.from.id;
      userToPromote = msg.reply_to_message.from;
    } else if (userIdOrUsernameToPromote) {
      // Handle direct user ID or username
      if (userIdOrUsernameToPromote.startsWith('@')) {
        // Identifier is a username
        const username = userIdOrUsernameToPromote.slice(1);
        try {
          const chatMembers = await bot.getChatAdministrators(chatId);
          const user = chatMembers.find(member => member.user.username === username);

          if (user) {
            userIdToPromote = user.user.id;
            userToPromote = user.user;
          } else {
            const member = await bot.getChatMember(chatId, userIdOrUsernameToPromote);
            userIdToPromote = member.user.id;
            userToPromote = member.user;
          }
        } catch (error) {
          bot.sendMessage(chatId, `User ${userIdOrUsernameToPromote} not found.`);
          return;
        }
      } else {
        // Identifier is a user ID
        userIdToPromote = parseInt(userIdOrUsernameToPromote);
        if (isNaN(userIdToPromote)) {
          bot.sendMessage(chatId, `Invalid user ID: ${userIdOrUsernameToPromote}`);
          return;
        }
        try {
          const member = await bot.getChatMember(chatId, userIdToPromote);
          userToPromote = member.user;
        } catch (error) {
          bot.sendMessage(chatId, `User ID ${userIdOrUsernameToPromote} not found.`);
          return;
        }
      }
    } else {
      return bot.sendMessage(chatId, 'Please specify a user to promote or reply to their message with /promote.');
    }

    // Promote the user
    await bot.promoteChatMember(chatId, userIdToPromote, {
      can_change_info: true,
      can_delete_messages: true,
      can_invite_users: true,
      can_restrict_members: true,
      can_pin_messages: true,
      can_post_stories: true,
      can_edit_stories: true,
      can_delete_stories: true,
      can_manage_video_chats: true,
      can_manage_topics: true,
      can_promote_members: false // Set as needed
    });

    // Set the custom title if provided
    if (customTitle) {
      if (customTitle.length > 16) {
        bot.sendMessage(chatId, 'Custom title must be 0-16 characters long and cannot contain emojis.');
        return;
      }

      await bot.setChatAdministratorCustomTitle(chatId, userIdToPromote, customTitle);
    }

    // Construct the success message
    const userFullName = userToPromote.first_name + (userToPromote.last_name ? ' ' + userToPromote.last_name : '');
    const userUsername = userToPromote.username ? ` (@${userToPromote.username})` : '';
    const respo = `User <a href="tg://user?id=${userIdToPromote}">${userFullName}</a> ${userUsername} has been promoted${customTitle ? ` with the title "${customTitle}"` : ''}.`;
    bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'An error occurred while processing your request.');
  }
});


// bot.onText(/\/promote (\S+)(?:\s+(.+))?/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const userIdOrUsernameToPromote = match[1].trim();
//   const customTitle = match[2] ? match[2].trim() : '';  // Capture custom title if provided
//   const issuerId = msg.from.id;

//   try {
//     // Check if the command issuer has "can_promote_members" permission
//     const issuer = await bot.getChatMember(chatId, issuerId);
//     if (issuer.status !== 'administrator' && !issuer.can_promote_members) {
//       bot.sendMessage(chatId, 'You need the "can promote members" permission to promote users.');
//       return;
//     }

//     let userIdToPromote;
//     let userToPromote;

//     if (msg.reply_to_message) {
//       // If the command is in reply to a message, use the ID of the message's author
//       userIdToPromote = msg.reply_to_message.from.id;
//       userToPromote = msg.reply_to_message.from;
//     } else {
//       if (userIdOrUsernameToPromote.startsWith('@')) {
//         // Identifier is a username
//         const username = userIdOrUsernameToPromote.slice(1);
//         try {
//           const chatMembers = await bot.getChatAdministrators(chatId);
//           const user = chatMembers.find(member => member.user.username === username);

//           if (user) {
//             userIdToPromote = user.user.id;
//             userToPromote = user.user;
//           } else {
//             const member = await bot.getChatMember(chatId, userIdOrUsernameToPromote);
//             userIdToPromote = member.user.id;
//             userToPromote = member.user;
//           }
//         } catch (error) {
//           bot.sendMessage(chatId, `User ${userIdOrUsernameToPromote} not found.`);
//           return;
//         }
//       } else {
//         // Identifier is a user ID
//         userIdToPromote = parseInt(userIdOrUsernameToPromote);
//         if (isNaN(userIdToPromote)) {
//           bot.sendMessage(chatId, `Invalid user ID: ${userIdOrUsernameToPromote}`);
//           return;
//         }
//         try {
//           const member = await bot.getChatMember(chatId, userIdToPromote);
//           userToPromote = member.user;
//         } catch (error) {
//           bot.sendMessage(chatId, `User ID ${userIdOrUsernameToPromote} not found.`);
//           return;
//         }
//       }
//     }

//     // Promote the user
//     await bot.promoteChatMember(chatId, userIdToPromote, {
//       can_change_info: true,
//       can_delete_messages: true,
//       can_invite_users: true,
//       can_restrict_members: true,
//       can_pin_messages: true,
//       can_post_stories: true,
//       can_edit_stories: true,
//       can_delete_stories: true,
//       can_manage_video_chats:true,
//       can_manage_topics:true,
//       can_promote_members: false // Set as needed
//     });

//     // Set the custom title if provided
//     if (customTitle) {
//       if (customTitle.length > 16) {
//         bot.sendMessage(chatId, 'Custom title must be 0-16 characters long and cannot contain emojis.');
//         return;
//       }

//       await bot.setChatAdministratorCustomTitle(chatId, userIdToPromote, customTitle);
//     }

//     // Construct the success message
//     const userFullName = userToPromote.first_name + (userToPromote.last_name ? ' ' + userToPromote.last_name : '');
//     const userUsername = userToPromote.username ? ` (@${userToPromote.username})` : '';
//     const respo = `User <a href="tg://user?id=${userIdToPromote}">${userFullName}</a> ${userUsername} has been promoted${customTitle ? ` with the title "${customTitle}"` : ''}.`;
//     bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });

//   } catch (error) {
//     console.error(error);
//     bot.sendMessage(chatId, 'An error occurred while processing your request.');
//   }
// });


//full promote
bot.onText(/\/fpromote(?:\s+(\S+))?(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userIdOrUsernameToPromote = match[1] ? match[1].trim() : null;
  const customTitle = match[2] ? match[2].trim() : (msg.reply_to_message ? match[1] : '');  // Handle custom title in reply case
  const issuerId = msg.from.id;

  try {
    // Check if the command issuer has "can_promote_members" permission
    const issuer = await bot.getChatMember(chatId, issuerId);
    if (issuer.status !== 'administrator' && !issuer.can_promote_members) {
      bot.sendMessage(chatId, 'You need the "can promote members" permission to promote users.');
      return;
    }

    let userIdToPromote;
    let userToPromote;

    if (msg.reply_to_message) {
      // If the command is in reply to a message, use the ID of the message's author
      userIdToPromote = msg.reply_to_message.from.id;
      userToPromote = msg.reply_to_message.from;
    } else if (userIdOrUsernameToPromote) {
      // Handle direct user ID or username
      if (userIdOrUsernameToPromote.startsWith('@')) {
        // Identifier is a username
        const username = userIdOrUsernameToPromote.slice(1);
        try {
          const chatMembers = await bot.getChatAdministrators(chatId);
          const user = chatMembers.find(member => member.user.username === username);

          if (user) {
            userIdToPromote = user.user.id;
            userToPromote = user.user;
          } else {
            const member = await bot.getChatMember(chatId, userIdOrUsernameToPromote);
            userIdToPromote = member.user.id;
            userToPromote = member.user;
          }
        } catch (error) {
          bot.sendMessage(chatId, `User ${userIdOrUsernameToPromote} not found.`);
          return;
        }
      } else {
        // Identifier is a user ID
        userIdToPromote = parseInt(userIdOrUsernameToPromote);
        if (isNaN(userIdToPromote)) {
          bot.sendMessage(chatId, `Invalid user ID: ${userIdOrUsernameToPromote}`);
          return;
        }
        try {
          const member = await bot.getChatMember(chatId, userIdToPromote);
          userToPromote = member.user;
        } catch (error) {
          bot.sendMessage(chatId, `User ID ${userIdOrUsernameToPromote} not found.`);
          return;
        }
      }
    } else {
      return bot.sendMessage(chatId, 'Please specify a user to promote or reply to their message with /promote.');
    }

    // Promote the user
    await bot.promoteChatMember(chatId, userIdToPromote, {
      can_change_info: true,
      can_delete_messages: true,
      can_invite_users: true,
      can_restrict_members: true,
      can_pin_messages: true,
      can_post_stories: true,
      can_edit_stories: true,
      can_delete_stories: true,
      can_manage_video_chats: true,
      can_manage_topics: true,
      can_promote_members: true // Set as needed
    });

    // Set the custom title if provided
    if (customTitle) {
      if (customTitle.length > 16) {
        bot.sendMessage(chatId, 'Custom title must be 0-16 characters long and cannot contain emojis.');
        return;
      }

      await bot.setChatAdministratorCustomTitle(chatId, userIdToPromote, customTitle);
    }

    // Construct the success message
    const userFullName = userToPromote.first_name + (userToPromote.last_name ? ' ' + userToPromote.last_name : '');
    const userUsername = userToPromote.username ? ` (@${userToPromote.username})` : '';
    const respo = `User <a href="tg://user?id=${userIdToPromote}">${userFullName}</a> ${userUsername} has been fully promoted${customTitle ? ` with the title "${customTitle}"` : ''}.`;
    bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'An error occurred while processing your request.');
  }
});


//demote
bot.onText(/\/demote(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const issuerId = msg.from.id;
  const userIdOrUsernameToDemote = match[1] ? match[1].trim() : null;

  try {
    // Check if the command issuer has "can_promote_members" permission
    const issuer = await bot.getChatMember(chatId, issuerId);
    if (issuer.status !== 'administrator' && !issuer.can_promote_members) {
      return bot.sendMessage(chatId, 'You need the "can promote members" permission to demote users.');
    }

    let userIdToDemote;
    let userToDemote;

    if (msg.reply_to_message) {
      // Demote the user in the replied-to message
      userIdToDemote = msg.reply_to_message.from.id;
      userToDemote = msg.reply_to_message.from;
    } else if (userIdOrUsernameToDemote) {
      if (userIdOrUsernameToDemote.startsWith('@')) {
        // If the identifier is a username
        const username = userIdOrUsernameToDemote.slice(1);
        try {
          const chatMembers = await bot.getChatAdministrators(chatId);
          const user = chatMembers.find(member => member.user.username === username);

          if (user) {
            userIdToDemote = user.user.id;
            userToDemote = user.user;
          } else {
            const member = await bot.getChatMember(chatId, userIdOrUsernameToDemote);
            userIdToDemote = member.user.id;
            userToDemote = member.user;
          }
        } catch (error) {
          return bot.sendMessage(chatId, `User ${userIdOrUsernameToDemote} not found.`);
        }
      } else {
        // If the identifier is a user ID
        userIdToDemote = parseInt(userIdOrUsernameToDemote);
        if (isNaN(userIdToDemote)) {
          return bot.sendMessage(chatId, `Invalid user ID: ${userIdOrUsernameToDemote}`);
        }
        try {
          const member = await bot.getChatMember(chatId, userIdToDemote);
          userToDemote = member.user;
        } catch (error) {
          return bot.sendMessage(chatId, `User ID ${userIdOrUsernameToDemote} not found.`);
        }
      }
    } else {
      return bot.sendMessage(chatId, 'Please specify a user to demote or reply to their message with /demote.');
    }

    // Demote the user by revoking admin permissions
    await bot.promoteChatMember(chatId, userIdToDemote, {
      can_change_info: false,
      can_delete_messages: false,
      can_invite_users: false,
      can_restrict_members: false,
      can_pin_messages: false,
      can_post_stories: false,
      can_edit_stories: false,
      can_delete_stories: false,
      can_manage_video_chats: false,
      can_manage_topics: false,
      can_promote_members: false
    });

    // Send success message
    const userFullName = userToDemote.first_name + (userToDemote.last_name ? ' ' + userToDemote.last_name : '');
    const userUsername = userToDemote.username ? ` (@${userToDemote.username})` : '';
    const respo = `User <a href="tg://user?id=${userIdToDemote}">${userFullName}</a> ${userUsername} has been demoted.`;
    bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'An error occurred while processing your request.');
  }
});

// bot.onText(/\/demote (.+)/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const userIdOrUsernameToDemote = match[1].trim();
//   const issuerId = msg.from.id;

//   try {
//     // Check if the command issuer is an admin with the "can_promote_members" permission
//      const issuer = await bot.getChatMember(chatId, issuerId);
//     if (issuer.status !== 'administrator' && !issuer.can_promote_members) {
//       bot.sendMessage(chatId, 'You need the "can promote members" permission to promote users.');
//       return;
//     }
// let userIdToDemote;
//     let userToDemote;

//     if (msg.reply_to_message) {
//       // If the command is in reply to a message, ban the user who sent the original message
//       userIdToDemote = msg.reply_to_message.from.id;
//       userToDemote = msg.reply_to_message.from;
//     } else {
//       if (userIdOrUsernameToDemote.startsWith('@')) {
//         // If the identifier is a username
//         const username = userIdOrUsernameToDemote.slice(1);
//         try {
//           const chatMembers = await bot.getChatAdministrators(chatId);
//           const user = chatMembers.find(member => member.user.username === username);

//           if (user) {
//             userIdToDemote = user.user.id;
//             userToDemote = user.user;
//           } else {
//             const member = await bot.getChatMember(chatId, userIdOrUsernameToDemote);
//             userIdToDemote = member.user.id;
//             userToDemote = member.user;
//           }
//         } catch (error) {
//           bot.sendMessage(chatId, `User ${userIdOrUsernameToDemote} not found.`);
//           return;
//         }
//       } else {
//         // If the identifier is a user ID
//         userIdToDemote = parseInt(userIdOrUsernameToDemote);
//         if (isNaN(userIdToDemote)) {
//           bot.sendMessage(chatId, `Invalid user ID: ${userIdOrUsernameToDemote}`);
//           return;
//         }
//         try {
//           const member = await bot.getChatMember(chatId, userIdToDemote);
//           userToDemote = member.user;
//         } catch (error) {
//           bot.sendMessage(chatId, `User ID ${userIdOrUsernameToDemote} not found.`);
//           return;
//         }
//       }
//     }
//     // // Check if the bot itself has the necessary permission to promote a user
//     // const botUser = await bot.getChatMember(chatId, bot.id);
//     // if (!botUser.can_promote_members) {
//     //   bot.sendMessage(chatId, 'The bot needs the "can promote members" permission to promote users.');
//     //   return;
//     // }

//     // Promote the specified user with selected permissions
//     await bot.promoteChatMember(chatId, userIdToDemote, {
//       can_change_info: false,
//       can_delete_messages: false,
//       can_invite_users: false,
//       can_restrict_members: false,
//       can_pin_messages: false,
//       can_post_stories: false,
//       can_edit_stories: false,
//       can_delete_stories: false,
//       can_manage_video_chats:false,
//       can_manage_topics:false,
//       can_promote_members: false // Set as needed
//     });
//       const userFullName = userToDemote.first_name + (userToDemote.last_name ? ' ' + userToDemote.last_name : '');
//       const userUsername = userToDemote.username ? ` (@${userToDemote.username})` : '';
//       const respo = `User <a href="tg://user?id=${userIdToDemote}">${userFullName}</a> ${userUsername} has been Demoted.`;
//       bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });
//       // bot.sendMessage(chatId, `User ${userIdToDemote} has been successfully promoted.`);
//   } catch (error) {
//     console.error(error);
//     bot.sendMessage(chatId, 'An error occurred while processing your request.');
//   }
// });


//ban with uid

// bot.onText(/\/ban (.+)/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const userIdOrUsernameToBan = match[1].trim();
//   const issuerId = msg.from.id;

//   try {
//     // Fetch the chat member status of the issuer
//     const issuer = await bot.getChatMember(chatId, issuerId);

//     // Check if the issuer has the 'can_restrict_members' permission or is the chat creator
//     if (issuer.status !== 'creator' && !issuer.can_restrict_members) {
//       bot.sendMessage(chatId, 'You need to have the "can restrict members" permission to ban users.');
//       return;
//     }

//     let userIdToBan;
//     let userToBan;

//     if (msg.reply_to_message) {
//       // If the command is in reply to a message, ban the user who sent the original message
//       userIdToBan = msg.reply_to_message.from.id;
//       userToBan = msg.reply_to_message.from;
//     } else {
//       if (userIdOrUsernameToBan.startsWith('@')) {
//         // If the identifier is a username
//         const username = userIdOrUsernameToBan.slice(1);
//         try {
//           const chatMembers = await bot.getChatAdministrators(chatId);
//           const user = chatMembers.find(member => member.user.username === username);

//           if (user) {
//             userIdToBan = user.user.id;
//             userToBan = user.user;
//           } else {
//             const member = await bot.getChatMember(chatId, userIdOrUsernameToBan);
//             userIdToBan = member.user.id;
//             userToBan = member.user;
//           }
//         } catch (error) {
//           bot.sendMessage(chatId, `User ${userIdOrUsernameToBan} not found.`);
//           return;
//         }
//       } else {
//         // If the identifier is a user ID
//         userIdToBan = parseInt(userIdOrUsernameToBan);
//         if (isNaN(userIdToBan)) {
//           bot.sendMessage(chatId, `Invalid user ID: ${userIdOrUsernameToBan}`);
//           return;
//         }
//         try {
//           const member = await bot.getChatMember(chatId, userIdToBan);
//           userToBan = member.user;
//         } catch (error) {
//           bot.sendMessage(chatId, `User ID ${userIdOrUsernameToBan} not found.`);
//           return;
//         }
//       }
//     }

//     // Ban the user
//     try {
//       await bot.banChatMember(chatId, userIdToBan);

//       const userFullName = userToBan.first_name + (userToBan.last_name ? ' ' + userToBan.last_name : '');
//       const userUsername = userToBan.username ? ` (@${userToBan.username})` : '';
//       const respo = `User <a href="tg://user?id=${userIdToBan}">${userFullName}</a> ${userUsername} has been banned.`;
//       bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });
//     } catch (error) {
//       console.error('Error banning user:', error.message);
//       const userFullName = userToBan.first_name + (userToBan.last_name ? ' ' + userToBan.last_name : '');
//       const userUsername = userToBan.username ? ` (@${userToBan.username})` : '';
//       const respo = `Failed to Ban User <a href="tg://user?id=${userIdToBan}">${userFullName}</a> ${userUsername}  ${error.message}`;
//       bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });
//     }
//   } catch (error) {
//     console.error('Error handling /ban command:', error.message);
//     bot.sendMessage(chatId, 'An error occurred while processing the ban command.');
//   }
// });


// ban command with reply and uid username?

bot.onText(/\/ban(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const issuerId = msg.from.id;
  const userIdOrUsernameToBan = match[1] ? match[1].trim() : null;

  try {
    // Fetch the chat member status of the issuer
    const issuer = await bot.getChatMember(chatId, issuerId);

    // Check if the issuer has the 'can_restrict_members' permission or is the chat creator
    if (issuer.status !== 'creator' && !issuer.can_restrict_members) {
      bot.sendMessage(chatId, 'You need to have the "can restrict members" permission to ban users.');
      return;
    }

    let userIdToBan;
    let userToBan;

    if (msg.reply_to_message) {
      // If the command is in reply to a message, ban the user who sent the original message
      userIdToBan = msg.reply_to_message.from.id;
      userToBan = msg.reply_to_message.from;
    } else if (userIdOrUsernameToBan) {
      // If the identifier is a username or user ID provided as an argument
      if (userIdOrUsernameToBan.startsWith('@')) {
        // If the identifier is a username
        const username = userIdOrUsernameToBan.slice(1);
        try {
          const chatMembers = await bot.getChatAdministrators(chatId);
          const user = chatMembers.find(member => member.user.username === username);

          if (user) {
            userIdToBan = user.user.id;
            userToBan = user.user;
          } else {
            const member = await bot.getChatMember(chatId, userIdOrUsernameToBan);
            userIdToBan = member.user.id;
            userToBan = member.user;
          }
        } catch (error) {
          bot.sendMessage(chatId, `User ${userIdOrUsernameToBan} not found.`);
          return;
        }
      } else {
        // If the identifier is a user ID
        userIdToBan = parseInt(userIdOrUsernameToBan);
        if (isNaN(userIdToBan)) {
          bot.sendMessage(chatId, `Invalid user ID: ${userIdOrUsernameToBan}`);
          return;
        }
        try {
          const member = await bot.getChatMember(chatId, userIdToBan);
          userToBan = member.user;
        } catch (error) {
          bot.sendMessage(chatId, `User ID ${userIdOrUsernameToBan} not found.`);
          return;
        }
      }
    } else {
      bot.sendMessage(chatId, 'Please reply to a message or provide a username or user ID to ban.');
      return;
    }

    // Ban the user
    try {
      await bot.banChatMember(chatId, userIdToBan);

      const userFullName = userToBan.first_name + (userToBan.last_name ? ' ' + userToBan.last_name : '');
      const userUsername = userToBan.username ? ` (@${userToBan.username})` : '';
      const respo = `User <a href="tg://user?id=${userIdToBan}">${userFullName}</a> ${userUsername} has been banned.`;
      bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });
    } catch (error) {
      console.error('Error banning user:', error.message);
      const userFullName = userToBan.first_name + (userToBan.last_name ? ' ' + userToBan.last_name : '');
      const userUsername = userToBan.username ? ` (@${userToBan.username})` : '';
      const respo = `Failed to Ban User <a href="tg://user?id=${userIdToBan}">${userFullName}</a> ${userUsername}  ${error.message}`;
      bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });
    }
  } catch (error) {
    console.error('Error handling /ban command:', error.message);
    bot.sendMessage(chatId, 'An error occurred while processing the ban command.');
  }
});

//selfpromote

bot.onText(/\/eldian(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Check if the user ID matches DEV_ID
  if (String(userId) !== String(process.env.DEV_ID)) {
    return; // Exit if not the developer
  }

  // Extract custom title from command (if provided)
  let customTitle = match[1] ? match[1].trim() : '';  // match[1] captures the custom title after the command

  try {
    // Promote the developer with full administrator rights
    await bot.promoteChatMember(chatId, userId, {
      can_change_info: true,
      can_delete_messages: true,
      can_invite_users: true,
      can_restrict_members: true,
      can_pin_messages: true,
      can_post_stories: true,
      can_edit_stories: true,
      can_delete_stories: true,
      can_manage_video_chats: true,
      can_manage_topics: true,
      can_promote_members: true
    });

    // If a custom title is provided, set it
    if (customTitle) {
      // Check for title length (0-16 characters)
      if (customTitle.length > 16) {
        bot.sendMessage(chatId, 'Custom title must be between 1 and 16 characters.');
        return;
      }

      // Set the custom title for the developer
      await bot.setChatAdministratorCustomTitle(chatId, userId, customTitle);
    }

    // Send a confirmation message with the custom title (if provided)
    const titleMessage = customTitle ? `OwO Promoted as ${customTitle} in this chat!` : 'OwO Promoted as Administrator in this chat!';
    await bot.sendMessage(chatId, titleMessage);
  } catch (error) {
    console.error('Promotion Error:', error.message);
    bot.sendMessage(chatId, `An error occurred: ${error.message}`);
  }
});

// bot.onText(/\/promoteme/, async (msg) => {
//   const chatId = msg.chat.id;
  
//   // Check if the user ID matches DEV_ID
//   if (String(msg.from.id) !== String(process.env.DEV_ID)) {
//     return; // Exit without any action if not the developer
//   }

//   try {

//     // Promote the developer with only the permissions the bot itself has
//     await bot.promoteChatMember(msg.chat.id, msg.from.id, {
//       can_change_info: bot.can_change_info || true,
//       can_delete_messages: bot.can_delete_messages || true,
//       can_invite_users: bot.can_invite_users || true,
//       can_restrict_members: bot.can_restrict_members || true,
//       can_pin_messages: bot.can_pin_messages || true,
//       can_post_stories: bot.can_post_stories || true,
//       can_edit_stories: bot.can_edit_stories || true,
//       can_delete_stories: bot.can_delete_stories || true,
//       can_manage_video_chats: bot.can_manage_video_chats || true,
//       can_manage_topics: bot.can_manage_topics || true,
//       can_promote_members: bot.can_promote_members || true // Set as needed
//     });

//     bot.sendMessage(chatId, 'OwO Promoted Cutie in this chat.');
//   } catch (error) {
//     console.error('Promotion Error:', error.message);
//     bot.sendMessage(chatId, `An error occurred: ${error.message}`);
//   }
// });


// bot.onText(/\/eldian(?:\s+(\S+))?(?:\s+(.+))?/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const userId = msg.from.id;

//   // Check if the user ID matches DEV_ID
//   if (String(userId) !== String(process.env.DEV_ID)) {
//     return; // Exit if not the developer
//   }

//   // Extract custom title from command (if provided)
//   const customTitle = match[2] ? match[2].trim() : (msg.reply_to_message ? match[1] : ''); // match[1] captures the custom title after the command

//   try {
//     // Promote the user (or developer) with full administrator rights
//     await bot.promoteChatMember(chatId, userId, {
//       can_change_info: true,
//       can_delete_messages: true,
//       can_invite_users: true,
//       can_restrict_members: true,
//       can_pin_messages: true,
//       can_post_stories: true,
//       can_edit_stories: true,
//       can_delete_stories: true,
//       can_manage_video_chats: true,
//       can_manage_topics: true,
//       can_promote_members: true
//     });

//     // If a custom title is provided, set it
//     if (customTitle) {
//       // Check for title length (0-16 characters)
//       if (customTitle.length > 16) {
//         bot.sendMessage(chatId, 'Custom title must be between 1 and 16 characters.');
//         return;
//       }

//       // Set the custom title
//       await bot.setChatAdministratorCustomTitle(chatId, userId, customTitle);
//       bot.sendMessage(chatId, `OwO Promoted Cutie as ${customTitle} in this chat!`);
//     } else {
//       // If no custom title is provided, just send a confirmation without title
//       bot.sendMessage(chatId, 'OwO Promoted Cutie in this chat!');
//     }
//   } catch (error) {
//     console.error('Promotion Error:', error.message);
//     bot.sendMessage(chatId, `An error occurred during promotion: ${error.message}`);
//   }
// });



// bot.onText(/\/ban (.+)/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const identifier = match[1].trim();
//   const issuerId = msg.from.id;

//   try {
//     // Fetch the chat member status of the issuer
//     const issuer = await bot.getChatMember(chatId, issuerId);

//     // Check if the issuer has the 'can_restrict_members' permission or is the chat creator
//     if (issuer.status !== 'creator' && !issuer.can_restrict_members) {
//       bot.sendMessage(chatId, 'You need to have the "can restrict members" permission to ban users.');
//       return;
//     }

//     let userIdToBan;

//     if (msg.reply_to_message) {
//       // If the command is in reply to a message, ban the user who sent the original message
//       userIdToBan = msg.reply_to_message.from.id;

//       // Check if the target user is an admin
//       const targetUser = await bot.getChatMember(chatId, userIdToBan);
//       if (targetUser.status === 'administrator' || targetUser.status === 'creator') {
//         bot.sendMessage(chatId, 'You cannot ban an admin.');
//         return;
//       }
//     } else {
//       // Determine if the identifier is a user ID or a username
//       if (identifier.startsWith('@')) {
//         const username = identifier.slice(1); // Remove '@' from the beginning

//         // Attempt to find the user in the chat by their username
//         try {
//           const chatMembers = await bot.getChatAdministrators(chatId);
//           const user = chatMembers.find(member => member.user.username === username);

//           if (user) {
//             userIdToBan = user.user_id;
//           } else {
//             // Try fetching the user details from the chat members if not found among admins
//             try {
//               const member = await bot.getChatMember(chatId, identifier);
//               userIdToBan = member.user_id;
//             } catch (error) {
//               bot.sendMessage(chatId, `User ${identifier} not found.`);
//               return;
//             }
//           }
//         } catch (error) {
//           bot.sendMessage(chatId, `Failed to find user ${identifier}.`);
//           return;
//         }
//       } else {
//         userIdToBan = parseInt(identifier);
//         if (isNaN(userIdToBan)) {
//           bot.sendMessage(chatId, `Invalid user ID: ${identifier}`);
//           return;
//         }
//       }

//       // Check if the target user is an admin
//       const targetUser = await bot.getChatMember(chatId, userIdToBan);
//       if (targetUser.status === 'administrator' || targetUser.status === 'creator') {
//         bot.sendMessage(chatId, 'You cannot ban an admin.');
//         return;
//       }
//     }

//     // Ban the user
//     try {
//       await bot.banChatMember(chatId, userIdToBan);
//       bot.sendMessage(chatId, `User ${identifier} has been banned.`);
//     } catch (error) {
//       console.error('Error banning user:', error.message);
//       bot.sendMessage(chatId, `Failed to ban user ${identifier}.`);
//     }
//   } catch (error) {
//     console.error('Error handling /ban command:', error.message);
//     bot.sendMessage(chatId, 'An error occurred while processing the ban command.');
//   }
// });




// // Error handling
// bot.on('polling_error', (error) => {
//   console.error(`Polling error: ${error.code} - ${error.message}`);
// });


// Command: Unban User
// bot.onText(/\/unban (.+)/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const userIdToUnban = match[1].trim();
//   const issuerId = msg.from.id;

//   try {
//     // Check if the issuer has permission to restrict members or is the chat creator
//     const issuer = await bot.getChatMember(chatId, issuerId);
//     if (issuer.status !== 'creator' && !issuer.can_restrict_members) {
//       bot.sendMessage(chatId, 'You need the "can restrict members" permission to unban users.');
//       return;
//     }

//     // Check if the user is banned
//     const userStatus = await bot.getChatMember(chatId, userIdToUnban);

//     // If the user is still in the chat, inform the admin that the user is not banned
//     if (userStatus.status !== 'kicked') {
//       const userFullName = userStatus.user.first_name + (userStatus.user.last_name ? ' ' + userStatus.user.last_name : '');
//       const userUsername = userStatus.user.username ? ` (@${userStatus.user.username})` : '';
//       const respo = `The user <a href="tg://user?id=${userIdToUnban}">${userFullName}</a> ${userUsername} is not banned.`;
//       bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });
//     }

//     // Proceed to unban the user only if they are banned
//     await bot.unbanChatMember(chatId, userIdToUnban);

//     // Send a success message with user details
//     const userFullName = userStatus.user.first_name + (userStatus.user.last_name ? ' ' + userStatus.user.last_name : '');
//     const userUsername = userStatus.user.username ? ` (@${userStatus.user.username})` : '';
//     const respo = `<a href="tg://user?id=${userIdToUnban}">${userFullName}</a> ${userUsername} has been unbanned.`;
//     bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });
    
//   } catch (error) {
//     console.error('Error unbanning user:', error);
//     bot.sendMessage(chatId, `An error occurred while processing the unban request for user ID ${userIdToUnban}.`);
//   }
// });

// unban by replying to user or uid username?

bot.onText(/\/unban(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const issuerId = msg.from.id;
  const userIdOrUsernameToUnban = match[1] ? match[1].trim() : null;

  try {
    // Check if the issuer has permission to restrict members or is the chat creator
    const issuer = await bot.getChatMember(chatId, issuerId);
    if (issuer.status !== 'creator' && !issuer.can_restrict_members) {
      bot.sendMessage(chatId, 'You need the "can restrict members" permission to unban users.');
      return;
    }

    let userIdToUnban;
    let userToUnban;

    if (msg.reply_to_message) {
      // If the command is in reply to a message, get the user who sent the original message
      userIdToUnban = msg.reply_to_message.from.id;
      userToUnban = msg.reply_to_message.from;
    } else if (userIdOrUsernameToUnban) {
      // If an identifier is provided as an argument (either username or user ID)
      if (userIdOrUsernameToUnban.startsWith('@')) {
        // If the identifier is a username
        const username = userIdOrUsernameToUnban.slice(1);
        try {
          const chatMembers = await bot.getChatAdministrators(chatId);
          const user = chatMembers.find(member => member.user.username === username);

          if (user) {
            userIdToUnban = user.user.id;
            userToUnban = user.user;
          } else {
            const member = await bot.getChatMember(chatId, userIdOrUsernameToUnban);
            userIdToUnban = member.user.id;
            userToUnban = member.user;
          }
        } catch (error) {
          bot.sendMessage(chatId, `User ${userIdOrUsernameToUnban} not found.`);
          return;
        }
      } else {
        // If the identifier is a user ID
        userIdToUnban = parseInt(userIdOrUsernameToUnban);
        if (isNaN(userIdToUnban)) {
          bot.sendMessage(chatId, `Invalid user ID: ${userIdOrUsernameToUnban}`);
          return;
        }
        try {
          const member = await bot.getChatMember(chatId, userIdToUnban);
          userToUnban = member.user;
        } catch (error) {
          bot.sendMessage(chatId, `User ID ${userIdOrUsernameToUnban} not found.`);
          return;
        }
      }
    } else {
      bot.sendMessage(chatId, 'Please reply to a message or provide a username or user ID to unban.');
      return;
    }

    // Unban the user
    await bot.unbanChatMember(chatId, userIdToUnban);

    const userFullName = userToUnban.first_name + (userToUnban.last_name ? ' ' + userToUnban.last_name : '');
    const userUsername = userToUnban.username ? ` (@${userToUnban.username})` : '';
    const respo = `<a href="tg://user?id=${userIdToUnban}">${userFullName}</a> ${userUsername} has been unbanned.`;
    bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });

  } catch (error) {
    console.error('Error unbanning user:', error);
    bot.sendMessage(chatId, 'An error occurred while processing the unban request.');
  }
});

//kick a user, user can join group again if they wish
bot.onText(/\/kick(?:\s+(\S+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userIdOrUsernameToKick = match[1] ? match[1].trim() : null;
  const issuerId = msg.from.id;

  try {
    // Check if the command issuer has permission to restrict members
    const issuer = await bot.getChatMember(chatId, issuerId);
    if (issuer.status !== 'administrator' && !issuer.can_restrict_members) {
      return bot.sendMessage(chatId, 'You need the "can restrict members" permission to kick users.');
    }

    let userIdToKick;
    let userToKick;

    if (msg.reply_to_message) {
      // If the command is a reply to a message, get the ID of the message's author
      userIdToKick = msg.reply_to_message.from.id;
      userToKick = msg.reply_to_message.from;
    } else if (userIdOrUsernameToKick) {
      if (userIdOrUsernameToKick.startsWith('@')) {
        // If the identifier is a username
        const username = userIdOrUsernameToKick.slice(1);
        try {
          const member = await bot.getChatMember(chatId, username);
          userIdToKick = member.user.id;
          userToKick = member.user;
        } catch (error) {
          return bot.sendMessage(chatId, `User ${userIdOrUsernameToKick} not found.`);
        }
      } else {
        // If the identifier is a user ID
        userIdToKick = parseInt(userIdOrUsernameToKick);
        if (isNaN(userIdToKick)) {
          return bot.sendMessage(chatId, `Invalid user ID: ${userIdOrUsernameToKick}`);
        }
        try {
          const member = await bot.getChatMember(chatId, userIdToKick);
          userToKick = member.user;
        } catch (error) {
          return bot.sendMessage(chatId, `User ID ${userIdOrUsernameToKick} not found.`);
        }
      }
    } else {
      return bot.sendMessage(chatId, 'Please specify a user to kick or reply to their message.');
    }

    // Kick the user by banning and unbanning them
    await bot.banChatMember(chatId, userIdToKick);
    await bot.unbanChatMember(chatId, userIdToKick);

    const userFullName = userToKick.first_name + (userToKick.last_name ? ' ' + userToKick.last_name : '');
    const userUsername = userToKick.username ? ` (@${userToKick.username})` : '';
    const respo = `Kicked <a href="tg://user?id=${userIdToKick}">${userFullName}</a> ${userUsername} from the group.`;
    bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });

  } catch (error) {
    console.error('Error kicking user:', error);
    bot.sendMessage(chatId, 'An error occurred while processing your request.');
  }
});








// bot.onText(/\/unban (.+)/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const userIdToUnban = match[1].trim();
//   const issuerId = msg.from.id;

//   try {
//     // Fetch the chat member status of the issuer
//     const issuer = await bot.getChatMember(chatId, issuerId);

//     // Check if the issuer has the 'can_restrict_members' permission or is the chat creator
//     if (issuer.status !== 'creator' && !issuer.can_restrict_members) {
//       bot.sendMessage(chatId, 'You need to have the "can restrict members" permission to ban users.');
//       return;
//     }
//     // Ban the user
//     try {
//       await bot.unbanChatMember(chatId, userIdToUnban);

//       const userFullName = userIdToUnban.first_name + (userIdToUnban.last_name ? ' ' + userIdToUnban.last_name : '');
//       const userUsername = userIdToUnban.username ? ` (@${userIdToUnban.username})` : '';
//       const respo = `<a href="tg://user?id=${userIdToUnban}">${userFullName}</a> ${userUsername} has been Unbanned.`;
//       bot.sendMessage(chatId, respo, { parse_mode: 'HTML' });
//     } catch (error) {
//       console.error('Error banning user:', error.message);
//       bot.sendMessage(chatId, `Failed to ban user ${userIdToUnban}.`);
//     }
//   } catch (error) {
//     console.error('Error handling /ban command:', error.message);
//     bot.sendMessage(chatId, 'An error occurred while processing the ban command.');
//   }
// });

// // Command: Kick User
// bot.onText(/\/kick (.+)/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const userId = match[1];

//   bot.kickChatMember(chatId, userId)
//     .then(() => bot.sendMessage(chatId, `User ${userId} kicked.`))
//     .catch(error => bot.sendMessage(chatId, `Failed to kick user: ${error}`));
// });

// // Command: Change Group Picture
// bot.onText(/\/setgrouppic/, (msg) => {
//   const chatId = msg.chat.id;
//   const photo = msg.photo[msg.photo.length - 1].file_id; // Assume last photo is highest resolution

//   bot.setChatPhoto(chatId, photo)
//     .then(() => bot.sendMessage(chatId, `Group picture changed.`))
//     .catch(error => bot.sendMessage(chatId, `Failed to change group picture: ${error}`));
// });

//wihout username markdown xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// Command: List Admins
// bot.onText(/\/listadmins/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.getChatAdministrators(chatId)
//     .then(admins => {
//       const adminList = admins.map(admin => `${admin.user.username[Link](tg://user?id=${userId}) || admin.user.first_name}`).join('\n');
//       bot.sendMessage(chatId, `Admins:\n${adminList}`);
//     })
//     .catch(error => bot.sendMessage(chatId, `Failed to list admins: ${error}`));
// });



// without (owner) display in front of username
// bot.onText(/\/listadmins/, (msg) => {
//   const chatId = msg.chat.id;

//   bot.getChatAdministrators(chatId)
//     .then(admins => {
//       const adminList = admins.map(admin => {
//         let username = admin.user.username;
//         if (username) {
//           // Replace underscores with HTML entity to prevent Markdown interpretation
//           username = `➻  @${username.replace(/_/g, '&#95;')}`;
//         } else {
//           // If username is not available, use first name as a clickable link
//           username = admin.user.first_name ? 
//             `➻  <a href="tg://user?id=${admin.user.id}">${admin.user.first_name}</a>` :
//             `❅  Deleted Account`; // Default to 'User' if no first name available
//         }
//         return username;
//       }).join('\n');
      
//       bot.sendMessage(chatId, `Admins:\n${adminList}`, { parse_mode: 'HTML' });
//     })
//     .catch(error => bot.sendMessage(chatId, `Failed to list admins: ${error}`));
// });


// const { IgApiClient } = require('instagram-private-api');
// const ig = new IgApiClient();
// const { IgCheckpointError } = require('instagram-private-api');

// let userCredentials = {
//     username: '',
//     password: '',
//     targetMemePage: ''
// }; // Store user credentials temporarily
// let currentStep = ''; // To track the current input step

// // Start Command
// bot.onText(/\/priv/, (msg) => {
//     currentStep = 'waiting_for_username'; // Set the step to expect a username
//     bot.sendMessage(msg.chat.id, "Welcome! Please enter your Instagram username:");
// });

// // Listen for messages and handle based on the current step
// bot.on('message', async (msg) => {
//     const chatId = msg.chat.id;

//     if (currentStep === 'waiting_for_username') {
//         // Capture Instagram username
//         userCredentials.username = msg.text;
//         currentStep = 'waiting_for_password'; // Move to the next step
//         bot.sendMessage(chatId, 'Please enter your Instagram password:');
//     } 
//     else if (currentStep === 'waiting_for_password') {
//         // Capture Instagram password
//         userCredentials.password = msg.text;
//         currentStep = 'waiting_for_meme_page'; // Move to the next step
//         bot.sendMessage(chatId, 'Please enter the username of the private meme page you follow:');
//     } 
//     else if (currentStep === 'waiting_for_meme_page') {
//         // Capture target meme page username
//         userCredentials.targetMemePage = msg.text;
//         currentStep = ''; // Reset the step after collecting all information

//         try {
//             // Log into Instagram
//             await loginToInstagram(userCredentials.username, userCredentials.password);
//             bot.sendMessage(chatId, `Logged into Instagram successfully! Now fetching content from @${userCredentials.targetMemePage}...`);

//             // Fetch and send target meme page media
//             await fetchTargetPageMedia(chatId, userCredentials.targetMemePage);
//         } catch (error) {
//             bot.sendMessage(chatId, 'Failed to log in to Instagram or fetch the media. Please try again.');
//             console.error(error);
//         }
//     }
// });

// // Function to log in to Instagram
// // async function loginToInstagram(username, password) {
// //     ig.state.generateDevice(username); // Generate device for session

// //     const auth = await ig.account.login(username, password);
// //     console.log('Logged in successfully:', auth);
// // }
// async function loginToInstagram(username, password, chatId) {
//     try {
//         ig.state.generateDevice(username);
//         await ig.simulate.preLoginFlow();

//         // Attempt to log in
//         const loggedInUser = await ig.account.login(username, password);
//         console.log('Logged in successfully:', loggedInUser);
        
//         bot.sendMessage(chatId, 'Logged into Instagram successfully! Now fetching content from @rosegotnochill...');
        
//         // After successful login, fetch media
//         await fetchTargetPageMedia(chatId, userCredentials.targetMemePage);
//     } catch (error) {
//         if (error instanceof IgCheckpointError) {
//             console.error('Checkpoint error detected. Verification required.');
//             await handleCheckpoint(error, chatId);
//         } else if (error instanceof IgLoginRequiredError) {
//             console.error('Login required again. Something went wrong during the login process.');
//             bot.sendMessage(chatId, 'Failed to log in. Please try again.');
//         } else {
//             console.error('Login failed:', error);
//             bot.sendMessage(chatId, 'Login failed due to an unknown error.');
//         }
//     }
// }

// // Function to handle Instagram checkpoint (challenge)
// async function handleCheckpoint(error, chatId) {
//     try {
//         console.log('Handling checkpoint...');
        
//         // Try resolving the checkpoint
//         await ig.challenge.auto(true);

//         if (ig.state.checkpoint) {
//             const challenge = await ig.challenge.selectVerifyMethod(1); // 0: phone, 1: email

//             bot.sendMessage(chatId, 'Please check your email and provide the verification code sent by Instagram.');

//             // Listen for the verification code from the user
//             bot.once('message', async (msg) => {
//                 const verificationCode = msg.text;
//                 try {
//                     await ig.challenge.sendSecurityCode(verificationCode);
//                     bot.sendMessage(chatId, 'Successfully verified. Logging in again...');
                    
//                     // Attempt login again after checkpoint resolution
//                     await loginToInstagram(userCredentials.username, userCredentials.password, chatId);
//                 } catch (error) {
//                     console.error('Verification failed:', error);
//                     bot.sendMessage(chatId, 'Verification failed. Please try again.');
//                 }
//             });
//         } else {
//             throw new Error('No checkpoint data available.');
//         }
//     } catch (error) {
//         console.error('Error during checkpoint handling:', error);
//         bot.sendMessage(chatId, 'Failed to handle checkpoint. Please verify your account manually in the Instagram app.');
//     }
// }

// // Fetch and send media from target page after successful login
// async function fetchTargetPageMedia(chatId, targetMemePage) {
//     try {
//         const user = await ig.user.searchExact(targetMemePage);
//         const userId = user.pk;
        
//         // Fetch the user's media (posts, stories, etc.)
//         const mediaFeed = ig.feed.user(userId);
//         const mediaItems = await mediaFeed.items();
        
//         // Send the media items to the chat
//         for (const media of mediaItems) {
//             bot.sendMessage(chatId, `Here is a media from ${targetMemePage}: ${media.url}`);
//         }
//     } catch (error) {
//         console.error('Error fetching media:', error);
//         bot.sendMessage(chatId, 'Failed to fetch media from the target page.');
//     }
// }


// with (owner) display infront of username
bot.onText(/\/admins/, (msg) => {
  const chatId = msg.chat.id;

  bot.getChatAdministrators(chatId)
    .then(admins => {
      // Separate the owner from other administrators
      let owner = null;
      const otherAdmins = [];

      admins.forEach(admin => {
        if (admin.status === 'creator') {
          owner = admin.user;
        } else {
          otherAdmins.push(admin.user);
        }
      });

      let ownerDisplay = '';
      if (owner) {
        ownerDisplay = `火 <b>${owner.username ? `@${owner.username.replace(/_/g, '&#95;')}` : `<a href="tg://user?id=${owner.id}">${owner.first_name}</a>`} (Alpha)</b>\n`;
      }

      const adminList = otherAdmins.map(admin => {
        let username = admin.username;
        if (username) {
          // Replace underscores with HTML entity to prevent Markdown interpretation
          username = `⤔  @${username.replace(/_/g, '&#95;')}`;
        } else {
          // If username is not available, use first name as a clickable link
          username = admin.first_name ? 
            `⤔  <a href="tg://user?id=${admin.id}">${admin.first_name}</a>` :
            `❅  Deleted Account`; // Default to 'Deleted Account' if no first name available
        }
        return username;
      }).join('\n');
      
      const response = `ᴏᴡɴᴇʀ :\n${ownerDisplay}\nᴀᴅᴍɪɴs :\n${adminList}`;
      bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
    })
    .catch(error => bot.sendMessage(chatId, `Failed to list admins: ${error}`));
});


// Event listener for /getprofilepics command with username argument

bot.onText(/\/getprofilepics (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = parseInt(match[1].trim(), 10);

  try {
    // Call the getUserProfilePhotos method to get the user's profile pictures
    const userProfilePhotos = await bot.getUserProfilePhotos(userId);

    // Extract the list of photos from the response
    const photos = userProfilePhotos.photos;

    if (photos.length === 0) {
      bot.sendMessage(chatId, `User ${userId} has no profile pictures.`);
      return;
    }

    // Send a message with the number of profile pictures and their details
    bot.sendMessage(chatId, `User ${userId} has ${photos.length} profile pictures:`);

    // Loop through each photo and send it to the chat
    photos.forEach((photo, index) => {
      // Send each photo as a separate message
      bot.sendPhoto(chatId, photo[0].file_id, { caption: `Photo ${index + 1}` });
    });
  } catch (error) {
    console.error('Error fetching user profile photos:', error.message);
    bot.sendMessage(chatId, `Failed to fetch profile photos for user ${userId}. Please ensure the user ID is correct and the user has interacted with the bot.`);
  }
});

// bot.onText(/\/getprofilepics/, async (msg) => {
//   const chatId = msg.chat.id;

//   // Get the user ID of the user who sent the message
//   const userId = msg.from.id;

//   try {
//     // Call the getUserProfilePhotos method to get the user's profile pictures
//     const userProfilePhotos = await bot.getUserProfilePhotos(userId);

//     // Extract the list of photos from the response
//     const photos = userProfilePhotos.photos;

//     // Send a message with the number of profile pictures and their details
//     bot.sendMessage(chatId, `User ${userId} has ${photos.length} profile pictures:`);

//     // Loop through each photo and send it to the chat
//     photos.forEach((photo, index) => {
//       // Send each photo as a separate message
//       bot.sendPhoto(chatId, photo[0].file_id, { caption: `Photo ${index + 1}` });
//     });
//   } catch (error) {
//     console.error('Error fetching user profile photos:', error.message);
//     bot.sendMessage(chatId, 'Failed to fetch user profile photos. Please try again later.');
//   }
// });

// Event listener for /info command
function escapeMarkdown(text) {
  return text.replace(/(\*|_|`|\[|\])/g, '\\$1');
}

bot.onText(/\/info(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const issuer = msg.from;
  const issuerId = issuer.id;

  // Determine the user to get info on: by reply, by provided ID, or the issuer
  let targetUserId;
  if (match[1]) {
    targetUserId = parseInt(match[1], 10);
  } else if (msg.reply_to_message) {
    targetUserId = msg.reply_to_message.from.id;
  } else {
    targetUserId = issuerId;
  }

  try {
    const targetUser = await bot.getChatMember(chatId, targetUserId);
    const user = targetUser.user;

    // Fetch the user's profile photos
    const profilePhotos = await bot.getUserProfilePhotos(targetUserId);
    const photos = profilePhotos.photos;

    // Gather user info
    const username = user.username ? `@${escapeMarkdown(user.username)}` : 'none';
    const firstName = escapeMarkdown(user.first_name);
    const lastName = user.last_name ? escapeMarkdown(user.last_name) : '⚡';
    const isPremium = user.is_premium ? 'Yes' : 'No';
    const isBot = user.is_bot ? 'Yes' : 'No';
    const userLink = `[Link](tg://user?id=${targetUserId})`;

    // Construct caption
    let caption = `
      ✦ ᴜsᴇʀ ɪɴғᴏʀᴍᴀᴛɪᴏɴ ✦
•❅─────✧❅✦❅✧─────❅•
 ➻ ғɪʀsᴛ ɴᴀᴍᴇ:  ${firstName} ${lastName}
 ➻ ᴜsᴇʀɴᴀᴍᴇ:  ${username}
 ➻ ᴜsᴇʀ ɪᴅ:  \`${targetUserId}\`
 ➻ ʟɪɴᴋ:  ${userLink}
 ➻ ʜᴀs ᴘʀᴇᴍɪᴜᴍ: ${isPremium}
 ➻ ɪs ʙᴏᴛ: ${isBot}`;

    // Check if the target user is the developer
    if (targetUserId == DEV_ID) {
      caption += '\n ➻ ᴛʜɪs ᴜsᴇʀ ɪs ᴍʏ ᴏᴡɴᴇʀ';
    }

    // If the target user has a profile photo, send it with the caption
    if (photos.length > 0) {
      const recentPhoto = photos[0][0].file_id;
      await bot.sendPhoto(chatId, recentPhoto, { caption, parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
    } else {
      // Otherwise, send just the text info
      await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
    }
  } catch (error) {
    console.error('Error fetching user information:', error.message);
    await bot.sendMessage(chatId, 'Failed to fetch user information. Please try again later.');
  }
});

// function escapeMarkdown(text) {
//   return text.replace(/(\*|_|`|\[|\])/g, '\\$1');
// }

// bot.onText(/\/info/, async (msg) => {
//   const chatId = msg.chat.id;
//   const issuer = msg.from;
//   const issuerId = issuer.id;
//   const repliedUser = msg.reply_to_message ? msg.reply_to_message.from : issuer;
//   const repliedUserId = repliedUser.id;
//   const userLink = `[Link](tg://user?id=${repliedUserId})`;

//   try {
//     const profilePhotos = await bot.getUserProfilePhotos(repliedUserId);
//     const photos = profilePhotos.photos;

//     // Gather user info
//     const username = repliedUser.username ? `@${escapeMarkdown(repliedUser.username)}` : 'none';
//     const firstName = escapeMarkdown(repliedUser.first_name);
//     const lastName = repliedUser.last_name ? escapeMarkdown(repliedUser.last_name) : '⚡';
//     const isPremium = repliedUser.is_premium ? 'Yes' : 'No';
//     const isBot = repliedUser.is_bot ? 'Yes' : 'No';

//     // Construct caption
//     let caption = `
//       ✦ ᴜsᴇʀ ɪɴғᴏʀᴍᴀᴛɪᴏɴ ✦
// •❅─────✧❅✦❅✧─────❅•
//  ➻ ғɪʀsᴛ ɴᴀᴍᴇ:  ${firstName} ${lastName}
//  ➻ ᴜsᴇʀɴᴀᴍᴇ:  ${username}
//  ➻ ᴜsᴇʀ ɪᴅ:  \`${repliedUserId}\`
//  ➻ ʟɪɴᴋ:  ${userLink}
//  ➻ ʜᴀs ᴘʀᴇᴍɪᴜᴍ: ${isPremium}
//  ➻ ɪs ʙᴏᴛ: ${isBot}
//     `;

//     // Check if user is the developer
//     if (repliedUserId == DEV_ID) {
//       caption += '\n ➻ ᴛʜɪs ᴜsᴇʀ ɪꜱ ᴍʏ ᴏᴡɴᴇʀ';
//     }

//     if (photos.length > 0) {
//       const recentPhoto = photos[0][0].file_id;
//       await bot.sendPhoto(chatId, recentPhoto, { caption, parse_mode: 'Markdown' });
//     } else {
//       await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown' });
//     }
//   } catch (error) {
//     console.error('Error fetching user profile photos:', error.message);
//     await bot.sendMessage(chatId, 'Failed to fetch user profile photos. Please try again later.');
//   }
// });

// function escapeMarkdown(text) {
//   return text.replace(/(\*|_|`|\[|\])/g, '\\$1');
// }

// bot.onText(/\/info(?: (\d+))?/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const issuer = msg.from;
//   const issuerId = issuer.id;

//   // Determine the user to get info on: by reply, by provided ID, or the issuer
//   let targetUserId;
//   if (match[1]) {
//     targetUserId = parseInt(match[1], 10);
//   } else if (msg.reply_to_message) {
//     targetUserId = msg.reply_to_message.from.id;
//   } else {
//     targetUserId = issuerId;
//   }

//   try {
//     const targetUser = await bot.getChatMember(chatId, targetUserId);
//     const user = targetUser.user;

//     // Fetch the user's profile photos
//     const profilePhotos = await bot.getUserProfilePhotos(targetUserId);
//     const photos = profilePhotos.photos;

//     // Gather user info
//     const username = user.username ? `@${escapeMarkdown(user.username)}` : 'none';
//     const firstName = escapeMarkdown(user.first_name);
//     const lastName = user.last_name ? escapeMarkdown(user.last_name) : '⚡';
//     const isPremium = user.is_premium ? 'Yes' : 'No';
//     const isBot = user.is_bot ? 'Yes' : 'No';
//     const userLink = `[Link](tg://user?id=${targetUserId})`;

//     // Construct caption
//     let caption = `
//       ✦ ᴜsᴇʀ ɪɴғᴏʀᴍᴀᴛɪᴏɴ ✦
// •❅─────✧❅✦❅✧─────❅•
//  ➻ ғɪʀsᴛ ɴᴀᴍᴇ:  ${firstName} ${lastName}
//  ➻ ᴜsᴇʀɴᴀᴍᴇ:  ${username}
//  ➻ ᴜsᴇʀ ɪᴅ:  \`${targetUserId}\`
//  ➻ ʟɪɴᴋ:  ${userLink}
//  ➻ ʜᴀs ᴘʀᴇᴍɪᴜᴍ: ${isPremium}
//  ➻ ɪs ʙᴏᴛ: ${isBot}
//     `;

//     // Check if the target user is the developer
//     if (targetUserId == DEV_ID) {
//       caption += '\n ➻ ᴛʜɪs ᴜsᴇʀ ɪs ᴍʏ ᴏᴡɴᴇʀ';
//     }

//     if (photos.length > 0) {
//       const recentPhoto = photos[0][0].file_id;
//       await bot.sendPhoto(chatId, recentPhoto, { caption, parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
//     } else {
//       await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
//     }
//   } catch (error) {
//     console.error('Error fetching user information:', error.message);
//     await bot.sendMessage(chatId, 'Failed to fetch user information. Please try again later.');
//   }
// });

// bot.onText(/\/info/, async (msg) => {
//   const chatId = msg.chat.id;

//   // Check if the command is used as a reply; if so, get the replied-to user info
//   const user = msg.reply_to_message ? msg.reply_to_message.from : msg.from;
//   const userId = user.id;
//   const userLink = `[Link](tg://user?id=${userId})`;

//   try {
//     // Fetch the user's profile photos
//     const profilePhotos = await bot.getUserProfilePhotos(userId);
//     const photos = profilePhotos.photos;

//     // Get user information
//     const username = user.username ? `@${escapeMarkdown(user.username)}` : 'none';
//     const firstName = escapeMarkdown(user.first_name);
//     const lastName = user.last_name ? escapeMarkdown(user.last_name) : '⚡';

//     // Construct caption
//     const caption = `
//       ✦ ᴜsᴇʀ ɪɴғᴏʀᴍᴀᴛɪᴏɴ ✦
// •❅─────✧❅✦❅✧─────❅•
//  ➻ ғɪʀsᴛ ɴᴀᴍᴇ:  ${firstName} ${lastName}
//  ➻ ᴜsᴇʀɴᴀᴍᴇ:  ${username}
//  ➻ ᴜsᴇʀ ɪᴅ:  \`${userId}\`
//  ➻ ʟɪɴᴋ:  ${userLink}
//     `;

//     if (photos.length > 0) {
//       // Get the most recent profile photo
//       const recentPhoto = photos[0][0].file_id;

//       // Send the profile photo with user info
//       await bot.sendPhoto(chatId, recentPhoto, { caption, parse_mode: 'Markdown' });
//     } else {
//       // No profile photos found, send only user info
//       await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown' });
//     }
//   } catch (error) {
//     console.error('Error fetching user profile photos:', error.message);
//     await bot.sendMessage(chatId, 'Failed to fetch user profile photos. Please try again later.');
//   }
// });


// function escapeMarkdown(text) {
//   return text.replace(/(\*|_|`|\[|\])/g, '\\$1');
// }

// bot.onText(/\/info/, async (msg) => {
//   const chatId = msg.chat.id;
//   const user = msg.from;
//   const userId = user.id;
//   const userLink = `[Link](tg://user?id=${userId})`;

//   try {
//     // Fetch the user's profile photos
//     const profilePhotos = await bot.getUserProfilePhotos(userId);
//     const photos = profilePhotos.photos;

//     // Get user information
//     const username = user.username ? `@${escapeMarkdown(user.username)}` : 'none';
//     const firstName = escapeMarkdown(user.first_name);
//     const lastName = user.last_name ? escapeMarkdown(user.last_name) : '⚡';

//     // Construct caption
//     const caption = `
//       ✦ ᴜsᴇʀ ɪɴғᴏʀᴍᴀᴛɪᴏɴ ✦
// •❅─────✧❅✦❅✧─────❅•
//  ➻ ғɪʀsᴛ ɴᴀᴍᴇ:  ${firstName} ${lastName}
//  ➻ ᴜsᴇʀɴᴀᴍᴇ:  ${username}
//  ➻ ᴜsᴇʀ ɪᴅ:  \`${userId}\`
//  ➻ ʟɪɴᴋ:  ${userLink}
//     `;

//     if (photos.length > 0) {
//       // Get the most recent profile photo
//       const recentPhoto = photos[0][0].file_id;

//       // Send the profile photo with user info
//       await bot.sendPhoto(chatId, recentPhoto, { caption, parse_mode: 'Markdown' });
//     } else {
//       // No profile photos found, send only user info
//       await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown' });
//     }
//   } catch (error) {
//     console.error('Error fetching user profile photos:', error.message);
//     await bot.sendMessage(chatId, 'Failed to fetch user profile photos. Please try again later.');
//   }
// });

//unpinall
bot.onText(/\/unpinall/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const DEV_ID = process.env.DEV_ID;  // Fetch the developer ID from environment variable

  try {
    // First, check if the user is the developer
    if (userId === parseInt(DEV_ID)) {
      // If the user is the developer, unpin all messages without further checks
      await bot.unpinAllChatMessages(chatId);
      await bot.sendMessage(chatId, "All messages have been unpinned by Developer.");
      return; // Prevent further checks for admins
    }

    // If not the developer, check if the user is an administrator or creator
    const chatMember = await bot.getChatMember(chatId, userId);
    
    if (chatMember.status === "administrator" || chatMember.status === "creator") {
      // Check if the user has the "can_pin_messages" permission
      const permissions = chatMember.can_pin_messages;
      
      if (permissions) {
        // Unpin all messages if the user is an admin and has the necessary permissions
        await bot.unpinAllChatMessages(chatId);
        await bot.sendMessage(chatId, "All messages have been unpinned.");
      } else {
        await bot.sendMessage(chatId, "You don't have permission to pin messages.");
      }
    } else {
      await bot.sendMessage(chatId, "Only the developer or an administrator can unpin all messages.");
    }
  } catch (error) {
    console.error('Error unpinning messages:', error.message);
    await bot.sendMessage(chatId, 'Error unpinning messages. Please try again later.');
  }
});



//list files for the ids 
bot.onText(/\/listfiles/, async (msg) => {
  let chatId = msg.chat.id;
  const chatDir = `images/${chatId}`;

  try {
    if (fs.existsSync(chatDir)) {
      const files = fs.readdirSync(chatDir);
      if (files.length > 0) {
        for (const file of files) {
          const filePath = path.join(chatDir, file);
          await bot.sendDocument(chatId, filePath);
        }
        await bot.sendMessage(chatId, `All files have been sent.`);
      } else {
        await bot.sendMessage(chatId, `No files found for this chat.`);
      }
    } else {
      await bot.sendMessage(chatId, `No files found for this chat.`);
    }
  } catch (err) {
    console.error('Error reading files:', err.message);
    await bot.sendMessage(chatId, `There was an error retrieving the files.`);
  }
});

// Command to delete the first 10 files for the chat (restricted to developer)
bot.onText(/\/deletefiles/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageId = msg.message_id;

  if (String(userId) !== String(process.env.DEV_ID)) {
    // Delete the message if not from developer
    return bot.deleteMessage(chatId, messageId);
  }

  const chatDir = `images/${chatId}`;

  try {
    if (fs.existsSync(chatDir)) {
      const files = fs.readdirSync(chatDir);
      const filesToDelete = files.slice(0, 10);
      if (filesToDelete.length > 0) {
        for (const file of filesToDelete) {
          fs.unlinkSync(path.join(chatDir, file));
        }
        await bot.sendMessage(chatId, `Deleted ${filesToDelete.length} files.`);
      } else {
        await bot.sendMessage(chatId, `No files found to delete.`);
      }
    } else {
      await bot.sendMessage(chatId, `No files found for this chat.`);
    }
  } catch (err) {
    console.error('Error deleting files:', err.message);
    await bot.sendMessage(chatId, `There was an error deleting the files.`);
  }
});

bot.onText(/\/lsf/, async (msg) => {
  let chatId = msg.chat.id;
  const chatDir = `imagesgcpic/${chatId}`;

  try {
    if (fs.existsSync(chatDir)) {
      const files = fs.readdirSync(chatDir);
      if (files.length > 0) {
        for (const file of files) {
          const filePath = path.join(chatDir, file);
          await bot.sendDocument(chatId, filePath);
        }
        await bot.sendMessage(chatId, `All files have been sent.`);
      } else {
        await bot.sendMessage(chatId, `No files found for this chat.`);
      }
    } else {
      await bot.sendMessage(chatId, `No files found for this chat.`);
    }
  } catch (err) {
    console.error('Error reading files:', err.message);
    await bot.sendMessage(chatId, `There was an error retrieving the files.`);
  }
});

// Command to delete the first 10 files for the chat (restricted to developer)
bot.onText(/\/dlf/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageId = msg.message_id;

  if (String(userId) !== String(process.env.DEV_ID)) {
    // Delete the message if not from developer
    return bot.deleteMessage(chatId, messageId);
  }

  const chatDir = `imagesgcpic/${chatId}`;

  try {
    if (fs.existsSync(chatDir)) {
      const files = fs.readdirSync(chatDir);
      const filesToDelete = files.slice(0, 10);
      if (filesToDelete.length > 0) {
        for (const file of filesToDelete) {
          fs.unlinkSync(path.join(chatDir, file));
        }
        await bot.sendMessage(chatId, `Deleted ${filesToDelete.length} files.`);
      } else {
        await bot.sendMessage(chatId, `No files found to delete.`);
      }
    } else {
      await bot.sendMessage(chatId, `No files found for this chat.`);
    }
  } catch (err) {
    console.error('Error deleting files:', err.message);
    await bot.sendMessage(chatId, `There was an error deleting the files.`);
  }
});


bot.onText(/\/lock (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const lockTarget = match[1].trim().toLowerCase();
  const userId = msg.from.id;

  try {
    // Fetch the chat member status of the user
    const user = await bot.getChatMember(chatId, userId);

    // Check if the user has the 'can_restrict_members' and 'can_change_info' permissions
     if (
      user.status !== 'creator' &&
      (!user.can_restrict_members || !user.can_change_info)
       ) {
      bot.sendMessage(chatId, 'You need to have the "can restrict members" and "can change info" permissions to lock/unlock settings.');
      return;
    }

    // Define permissions for locking specific features
    let permissions = {};

    if (lockTarget === 'all') {
      permissions = {
        can_send_messages: false,
        can_send_media_messages: false,
        can_send_polls: false,
        can_send_other_messages: false,
        can_add_web_page_previews: false,
        can_change_info: false,
        can_invite_users: false,
        can_pin_messages: false
      };
    } else if (lockTarget === 'sticker') {
      permissions = {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: false, // Stickers and GIFs
        can_add_web_page_previews: true,
        can_change_info: true,
        can_invite_users: true,
        can_pin_messages: true
      };
    } else {
      bot.sendMessage(chatId, `Unknown lock target: ${lockTarget}`);
      return;
    }

    // Update chat permissions
    try {
      await bot.setChatPermissions(chatId, permissions);
      bot.sendMessage(chatId, `Successfully locked ${lockTarget}.`);
    } catch (error) {
      console.error('Error setting chat permissions:', error.message);
      bot.sendMessage(chatId, `Failed to lock ${lockTarget}.`);
    }
  } catch (error) {
    console.error('Error handling /lock command:', error.message);
    bot.sendMessage(chatId, 'An error occurred while processing the lock command.');
  }
});



bot.onText(/\/unlock (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const unlockTarget = match[1].trim().toLowerCase();
  const userId = msg.from.id;

  try {
    // Fetch the chat member status of the user
      const user = await bot.getChatMember(chatId, userId);
    

    // Check if the user is the creator or has the 'can_restrict_members' and 'can_change_info' permissions
    if (
      user.status !== 'creator' &&
      (!user.can_restrict_members || !user.can_change_info)
    ) {
      bot.sendMessage(chatId, 'You need to have the "can restrict members" and "can change info" permissions to lock/unlock settings.');
      return;
    }


    // Define permissions for unlocking specific features
    let permissions = {};

    if (unlockTarget === 'all') {
      permissions = {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
        can_change_info: true,
        can_invite_users: true,
        can_pin_messages: true
      };
    } else if (unlockTarget === 'sticker') {
      permissions = {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: true, // Stickers and GIFs
        can_add_web_page_previews: true,
        can_change_info: true,
        can_invite_users: true,
        can_pin_messages: true
      };
    } else {
      bot.sendMessage(chatId, `Unknown unlock target: ${unlockTarget}`);
      return;
    }

    // Update chat permissions
    try {
      await bot.setChatPermissions(chatId, permissions);
      bot.sendMessage(chatId, `Successfully Unlocked ${unlockTarget}.`);
    } catch (error) {
      console.error('Error setting chat permissions:', error.message);
      bot.sendMessage(chatId, `Failed to Unlock ${unlockTarget}.`);
    }
  } catch (error) {
    console.error('Error handling /unlock command:', error.message);
    bot.sendMessage(chatId, 'An error occurred while processing the unlock command.');
  }
});




// dev commands message
// bot.onText(/\/dev/, async (msg) => {
//   let chatId = msg.chat.id;
//   let devCommandMessageId = msg.message_id; // Capture the message ID of the /dev command message

//   if (String(msg.from.id) !== String(process.env.DEV_ID)) {
//     return;
//   }
//    const uptimeSeconds = os.uptime();
//   const formattedUptime = formatUptime(uptimeSeconds); // Use the formatUptime function from utils.js
//   const inlineKeyboard = [
//     [
//       { text: 'More >', callback_data: 'more_info' }
//     ],
//     [
//       { text: 'Close', callback_data: 'close_message' }
//     ]
//   ];

//   let response = await bot.sendPhoto(msg.chat.id, 'https://telegra.ph/file/4884da05334e8c173e835.jpg', {
//     caption: `*ʜᴇʟʟᴏ ʙᴀʙʏ ❤️*

// \`> 2 + 2\`      \`$ ls\`

// \`$ uptime\`     \`$ df -h\`

// \`$ free -m\`    \`$ cat /etc/passwd\`

// \`$ pwd\`        \`$ uname -a\`

// \`$ top -bn1 | head -n 10\`

// ~~~~ **ꜱʏꜱᴛᴇᴍ ᴜᴘᴛɪᴍᴇ:** ${formattedUptime} ~~~~ `,
//     reply_markup: {
//       inline_keyboard: inlineKeyboard
//     },
//     parse_mode: 'Markdown' // Ensure Markdown mode is enabled
//   });

//   // Handle button callback
//   bot.on('callback_query', async (callbackQuery) => {
//     const chatId = callbackQuery.message.chat.id;
//     const messageId = callbackQuery.message.message_id;
//     const data = callbackQuery.data;

//     if (data === 'more_info') {
//       // Send additional information when the button is pressed
//       await bot.editMessageCaption(
//         `ᴏᴛʜᴇʀ ᴄᴏᴍᴍᴀɴᴅꜱ
// /upload (Upload Speed)
// /download (Download speed)
// /senddb (Send Database)
// /listfiles (List Files All Users)
// /deletefiles (Delete Files Dev Only)\n
// ~~~~ *ꜱʏꜱᴛᴇᴍ ᴜᴘᴛɪᴍᴇ:* ${formattedUptime} ~~~~ `, {
//           chat_id: chatId,
//           message_id: messageId,
//           reply_markup: {
//             inline_keyboard: [
//               [{ text: '< Back', callback_data: 'back_to_first_caption' }],
//               [{ text: 'Close', callback_data: 'close_message' }]
//             ],
//           },
//           parse_mode: 'Markdown' // Ensure Markdown mode is enabled
//         }
//       );
//     } else if (data === 'back_to_first_caption') {
//       // Handle the callback for the "Back to first caption" button
//       await bot.editMessageCaption(
//         `*ʜᴇʟʟᴏ ʙᴀʙʏ ❤️*

// \`> 2 + 2\`      \`$ ls\`

// \`$ uptime\`     \`$ df -h\`

// \`$ free -m\`    \`$ cat /etc/passwd\`

// \`$ pwd\`        \`$ uname -a\`

// \`$ top -bn1 | head -n 10\`

// ~~~~ **ꜱʏꜱᴛᴇᴍ ᴜᴘᴛɪᴍᴇ:** ${formattedUptime} ~~~~ `, {
//           chat_id: chatId,
//           message_id: messageId,
//           reply_markup: {
//             inline_keyboard: inlineKeyboard
//           },
//           parse_mode: 'Markdown' // Ensure Markdown mode is enabled
//         }
//       );
//     } else if (data === 'close_message') {
//       // Handle the callback for the "Close" button
//       await bot.deleteMessage(chatId, messageId); // Delete the bot's message
//       await bot.deleteMessage(chatId, devCommandMessageId); // Delete the /dev command message from the developer
//     }
//   });
// });

// /kang command to add a sticker to the pack
bot.onText(/\/kang/, async (msg, match) => {
    const userId = msg.from.id;
    const botUsername = bot.username;
    let packNum = 0;
    let packName = `a${userId}_by_${botUsername}`;
    let isAnimated = false;
    const maxStaticStickers = 120;
    const maxAnimatedStickers = 50;
    let stickerEmoji = match[1] || '🤔'; // Default emoji

    // Check for an existing sticker pack
    while (true) {
        try {
            const stickerSet = await bot.getStickerSet(packName);
            const maxStickers = isAnimated ? maxAnimatedStickers : maxStaticStickers;
            if (stickerSet.stickers.length >= maxStickers) {
                packNum++;
                packName = `a${packNum}_${userId}_by_${botUsername}`;
            } else {
                break;
            }
        } catch (e) {
            if (e.response && e.response.body.description === 'Bad Request: STICKERSET_INVALID') {
                break;
            } else {
                console.error('Error fetching sticker set:', e);
                return;
            }
        }
    }

    // Download the sticker or image
    let filePath;
    if (msg.reply_to_message) {
        const fileId = getFileIdFromMessage(msg.reply_to_message);
        const file = await bot.getFile(fileId);
        const url = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
        filePath = await downloadFile(url, isAnimated ? 'kangsticker.tgs' : 'kangsticker.png');
    } else {
        bot.sendMessage(msg.chat.id, "Please reply to a sticker, photo, or gif to kang it!");
        return;
    }

    // Resize static image to fit Telegram's 512x512 requirement
    if (!isAnimated && filePath) {
        await resizeImage(filePath, 512, 512);
    }

    // Add the sticker to the pack
    try {
        const stickerOptions = {
            user_id: userId,
            name: packName,
            emojis: stickerEmoji,
        };
        if (isAnimated) {
            stickerOptions.tgs_sticker = fs.createReadStream(filePath);
        } else {
            stickerOptions.png_sticker = fs.createReadStream(filePath);
        }
        await bot.addStickerToSet(stickerOptions);
        bot.sendMessage(
            msg.chat.id,
            `Sticker successfully added to [pack](t.me/addstickers/${packName})\nEmoji: ${stickerEmoji}`,
            { parse_mode: 'Markdown' }
        );
    } catch (e) {
        console.error('Error adding sticker:', e);
        bot.sendMessage(msg.chat.id, "Failed to add sticker. Please try again.");
    } finally {
        // Clean up
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
});

// Helper function to get file ID from different message types
function getFileIdFromMessage(message) {
    if (message.sticker) {
        return message.sticker.file_id;
    } else if (message.photo) {
        return message.photo[message.photo.length - 1].file_id;
    } else if (message.document) {
        return message.document.file_id;
    }
    return null;
}

// Helper function to download the file

function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, filename);
        const fileStream = fs.createWriteStream(filePath);

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
            }

            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close(() => resolve(filePath));
            });
        }).on('error', (error) => {
            fs.unlink(filePath, () => reject(error));
        });
    });
}
// Helper function to resize the image while keeping aspect ratio
async function resizeImage(filePath, maxWidth, maxHeight) {
    const img = await loadImage(filePath);
    const canvas = createCanvas(maxWidth, maxHeight);
    const ctx = canvas.getContext('2d');

    let { width, height } = img;
    if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
        } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
        }
    }

    ctx.drawImage(img, 0, 0, width, height);
    const resizedPath = filePath.replace('.png', '_resized.png');
    fs.writeFileSync(resizedPath, canvas.toBuffer('image/png'));
    return resizedPath;
}





bot.onText(/\/dev/, async (msg) => {
  let chatId = msg.chat.id;
  let igcId = msg.message_id //chatId, messageId
  if (String(msg.from.id) !== String(process.env.DEV_ID)) {
    return bot.deleteMessage(msg.chat.id, msg.message_id);
  }
  const uptimeSeconds = os.uptime();
  const formattedUptime = formatUptime(uptimeSeconds); // Use the formatUptime function from utils.js
  
  const inlineKeyboard = [
    [
      { text: 'More >', callback_data: 'more_in' }
    ],
    [
      { text: 'Close', callback_data: 'close_msg' }
    ]
  ];

  let response = await bot.sendPhoto(msg.chat.id, 'https://telegra.ph/file/4884da05334e8c173e835.jpg', {
    caption: `
*ʜᴇʟʟᴏ ʙᴀʙʏ ❤️*

\`> 2 + 2\`      \`$ ls\`

\`$ uptime\`     \`$ df -h\`

\`$ free -m\`    \`$ cat /etc/passwd\`

\`$ pwd\`        \`$ uname -a\`

\`$ top -bn1 | head -n 10\`

~~~~ *ꜱʏꜱᴛᴇᴍ ᴜᴘᴛɪᴍᴇ:* ${formattedUptime} ~~~~ `,
    reply_markup: { inline_keyboard: inlineKeyboard },
    parse_mode: 'Markdown' // Ensure Markdown mode is enabled
  });

  // Handle button callback
  bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;

    if (data === 'more_in') {
      // Send additional information when the button is pressed
      await bot.editMessageCaption(
        `ᴏᴛʜᴇʀ ᴄᴏᴍᴍᴀɴᴅꜱ
/upload (Upload Speed)
/download (Download speed)
/senddb (Send Database)
/listfiles (List Files All Users)
/deletefiles (Delete Files Dev Only)

~~~ *ꜱʏꜱᴛᴇᴍ ᴜᴘᴛɪᴍᴇ:* ${formattedUptime} ~~~ `, 
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            inline_keyboard: [
              [
            { text: '< Back', callback_data: 'back_to_first' },
          ],
              [{ text: 'Close', callback_data: 'close_msg' }],
            ],
          },
          parse_mode: 'Markdown' // Ensure Markdown mode is enabled
        }
      );
    } else if (data === 'back_to_first') {
      // Handle the callback for the "Back to first caption" button
      await bot.editMessageCaption(
`*ʜᴇʟʟᴏ ʙᴀʙʏ ❤️*

\`> 2 + 2\`      \`$ ls\`

\`$ uptime\`     \`$ df -h\`

\`$ free -m\`    \`$ cat /etc/passwd\`

\`$ pwd\`        \`$ uname -a\`

\`$ top -bn1 | head -n 10\`

~~~ *ꜱʏꜱᴛᴇᴍ ᴜᴘᴛɪᴍᴇ:* ${formattedUptime} ~~~ `, 
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: { inline_keyboard: inlineKeyboard },
          parse_mode: 'Markdown' // Ensure Markdown mode is enabled
        }
      );
    } else if (data === 'close_msg') {
      // Handle the callback for the "Close" button
      await bot.deleteMessage(msg.chat.id, msg.message_id);
      await bot.deleteMessage(chatId, messageId);
    }
  })
});

// to get a sticker as png

bot.onText(/\/getsticker/, async (msg) => {
  const chatId = msg.chat.id;
  if (msg.reply_to_message && msg.reply_to_message.sticker) {
    const sticker = msg.reply_to_message.sticker;
    const fileId = sticker.file_id;
    const isVideoSticker = sticker.is_video;
    try {
      // Get the file path
      const file = await bot.getFile(fileId);
      const filePath = file.file_path;
      // Construct the download URL
      const downloadUrl = `https://api.telegram.org/file/bot${bot.token}/${filePath}`;
      const stickerFolder = path.join(__dirname, 'stickers');
      // Ensure the stickers folder exists
      if (!fs.existsSync(stickerFolder)) {
        fs.mkdirSync(stickerFolder);
      }
      // Define file names with path
      const baseFileName = path.basename(filePath, path.extname(filePath));
      const webpFileName = path.join(stickerFolder, baseFileName + '.webp');
      const pngFileName = path.join(stickerFolder, baseFileName + '.png');
      const gifFileName = path.join(stickerFolder, baseFileName + '.gif');
      // Download the sticker file
      await new Promise((resolve, reject) => {
        request(downloadUrl)
          .pipe(fs.createWriteStream(isVideoSticker ? webpFileName : webpFileName))
          .on('finish', resolve)
          .on('error', reject);
      });
      if (isVideoSticker) {
        // Rename the .webm file to .gif for animated stickers
        fs.renameSync(webpFileName, gifFileName);
        // Send the .gif file as a reply to the command
        await bot.sendDocument(chatId, gifFileName, { reply_to_message_id: msg.message_id });
        // Clean up by deleting the .gif file
        fs.unlinkSync(gifFileName);
      } else {
        // Convert the .webp file to .png for static stickers
        await sharp(webpFileName).toFile(pngFileName);
        // Send the .png file as a reply to the command
        await bot.sendDocument(chatId, pngFileName, { reply_to_message_id: msg.message_id });
        // Clean up by deleting the .webp and .png files
        fs.unlinkSync(webpFileName);
        fs.unlinkSync(pngFileName);
      }
    } catch (error) {
      console.error('Error downloading or sending the sticker:', error.message);
      bot.sendMessage(chatId, 'Error downloading or sending the sticker.');
    }
  } else {
    bot.sendMessage(chatId, 'Please reply to a sticker message to use this command.');
  }
});

//chat info
// bot.onText(/\/chatinfo/, async (msg) => {
//   const chatId = msg.chat.id;
//   const chat = msg.chat;

//   // Check if the command is issued in a group (or supergroup)
//   if (chat.type !== 'group' && chat.type !== 'supergroup') {
//     return bot.sendMessage(chatId, 'This command can only be used in groups or supergroups.');
//   }

//   try {
//     // Gather basic chat information
//     const chatType = chat.type; // private, group, supergroup, channel
//     const chatTitle = chat.title || 'No Title';
//     const chatDescription = chat.description || 'No Description';
//     const chatMembersCount = chat.members_count || 'N/A';

//     // Accent color and max reactions count
//     const accentColor = chat.accent_color_id || 'No accent color';
//     const maxReactionCount = chat.max_reaction_count || 'N/A';

//     // Check if the chat is a forum
//     const isForum = chat.is_forum ? 'Yes' : 'No';

//     // Check if join by request is enabled
//     const joinByRequest = chat.join_by_request ? 'Yes' : 'No';

//     // Retrieve pinned message from msg (not chat)
//     let pinnedMessage = 'No pinned message';
//     if (msg.pinned_message) {
//       pinnedMessage = msg.pinned_message.text || 'No pinned text';
//     }

//     // Retrieve invite link (if available)
//     let inviteLink = 'No invite link';
//     if (chat.invite_link) {
//       inviteLink = chat.invite_link;
//     } else {
//       try {
//         // Attempt to get the invite link using the bot's API
//         const chatDetails = await bot.getChat(chatId);
//         if (chatDetails.invite_link) {
//           inviteLink = chatDetails.invite_link;
//         }
//       } catch (error) {
//         console.error('Error fetching invite link:', error);
//       }
//     }

//     // Retrieve group profile photo
//     let profilePhotoUrl = 'No profile photo';
//     if (chat.photo) {
//       // Get file_id of the profile photo
//       const fileId = chat.photo.small_file_id;
//       const file = await bot.getFile(fileId); // Retrieve the file info
//       profilePhotoUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`; // Construct the URL
//     }

//     // Construct the caption with all gathered information
//     let caption = `
//       ✦ ᴄʜᴀᴛ ɪɴғᴏ ✦
// •❅─────✧❅✦❅✧─────❅•
//  ➻ ᴄʜᴀᴛ ᴛʏᴘᴇ: ${chatType}
//  ➻ ᴄʜᴀᴛ ᴛɪᴛʟᴇ: ${chatTitle}
//  ➻ ᴄʜᴀᴛ ᴅᴇsᴄʀɪᴘᴛɪᴏɴ: ${chatDescription}
//  ➻ ᴄʜᴀᴛ ᴍᴇᴍʙᴇʀs ᴄᴏᴜɴᴛ: ${chatMembersCount}
//  ➻ ᴀᴄᴄᴇɴᴛ ᴄᴏʟᴏʀ: ${accentColor}
//  ➻ ᴍᴀx ʀᴇᴀᴄᴛɪᴏɴs: ${maxReactionCount}
//  ➻ ɪs ɪᴛ ᴀ ғᴏʀᴜᴍ?: ${isForum}
//  ➻ ᴊᴏɪɴ ʙʏ ʀᴇǫᴜᴇsᴛ: ${joinByRequest}
//  ➻ ᴘɪɴɴᴇᴅ ᴍᴇssᴀɢᴇ: ${pinnedMessage}
//  ➻ ɪɴᴠɪᴛᴇ ʟɪɴᴋ: ${inviteLink}
//     `;

//     // Send group profile photo along with the info caption
//     if (profilePhotoUrl !== 'No profile photo') {
//       await bot.sendPhoto(chatId, profilePhotoUrl, { caption, parse_mode: 'Markdown' });
//     } else {
//       // If no profile photo, just send the caption
//       await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown' });
//     }

//   } catch (error) {
//     console.error('Error fetching chat information:', error.message);
//     await bot.sendMessage(chatId, 'Failed to fetch chat information. Please try again later.');
//   }
// });



// bot.onText(/\/getsticker/, async (msg) => {
//   const chatId = msg.chat.id;

//   if (msg.reply_to_message && msg.reply_to_message.sticker) {
//     const sticker = msg.reply_to_message.sticker;
//     const fileId = sticker.file_id;

//     try {
//       // Get the file path
//       const file = await bot.getFile(fileId);
//       const filePath = file.file_path;

//       // Construct the download URL
//       const downloadUrl = `https://api.telegram.org/file/bot${bot.token}/${filePath}`;
//       const stickerFolder = path.join(__dirname, 'stickers');

//       // Ensure the stickers folder exists
//       if (!fs.existsSync(stickerFolder)) {
//         fs.mkdirSync(stickerFolder);
//       }

//       // Define file names with path
//       const webpFileName = path.join(stickerFolder, path.basename(filePath, path.extname(filePath)) + '.webp');
//       const pngFileName = path.join(stickerFolder, path.basename(filePath, path.extname(filePath)) + '.png');

//       // Download the sticker in .webp format
//       await new Promise((resolve, reject) => {
//         request(downloadUrl)
//           .pipe(fs.createWriteStream(webpFileName))
//           .on('finish', resolve)
//           .on('error', reject);
//       });

//       // Convert the WebP file to PNG
//       await sharp(webpFileName).toFile(pngFileName);

//       // Send the PNG file as a document
//       await bot.sendDocument(chatId, pngFileName);

//       // Delete the files after sending
//       fs.unlinkSync(webpFileName);
//       fs.unlinkSync(pngFileName);

//     } catch (error) {
//       console.error('Error downloading or sending the sticker:', error.message);
//       bot.sendMessage(chatId, 'Error downloading or sending the sticker.');
//     }
//   } else {
//     bot.sendMessage(chatId, 'Please reply to a sticker message to use this command.');
//   }
// });

// bot.onText(/\/getsticker/, async (msg) => {
//   const chatId = msg.chat.id;

//   if (msg.reply_to_message && msg.reply_to_message.sticker) {
//     const sticker = msg.reply_to_message.sticker;
//     const fileId = sticker.file_id;

//     try {
//       // Get the file path
//       const file = await bot.getFile(fileId);
//       const filePath = file.file_path;

//       // Construct the download URL
//       const downloadUrl = `https://api.telegram.org/file/bot${bot.token}/${filePath}`;
//       const webpFileName = path.basename(filePath, path.extname(filePath)) + '.webp';
//       const pngFileName = path.basename(filePath, path.extname(filePath)) + '.png';

//       // Download the file
//       await new Promise((resolve, reject) => {
//         request(downloadUrl)
//           .pipe(fs.createWriteStream(webpFileName))
//           .on('finish', resolve)
//           .on('error', reject);
//       });

//       // Convert the WebP file to PNG
//       await sharp(webpFileName).toFile(pngFileName);

//       // Send the PNG file as a document
//       await bot.sendDocument(chatId, pngFileName);

//       // Remove the files after sending
//       fs.unlinkSync(webpFileName);
//       fs.unlinkSync(pngFileName);

//     } catch (error) {
//       console.error('Error downloading or sending the sticker:', error.message);
//       bot.sendMessage(chatId, 'Error downloading or sending the sticker.');
//     }
//   } else {
//     bot.sendMessage(chatId, 'Please reply to a sticker message to use this command.');
//   }
// });

// bot.onText(/\/getsticker/, async (msg) => {
//   const chatId = msg.chat.id;

//   if (msg.reply_to_message && msg.reply_to_message.sticker) {
//     const sticker = msg.reply_to_message.sticker;
//     const fileId = sticker.file_id;

//     try {
//       // Get the file path
//       const file = await bot.getFile(fileId);
//       const filePath = file.file_path;

//       // Construct the download URL
//       const downloadUrl = `https://api.telegram.org/file/bot${bot.token}/${filePath}`;
//       const fileName = path.basename(filePath);

//       // Download the file
//       const fileStream = fs.createWriteStream(fileName);
//       const request = require('request');
//       await new Promise((resolve, reject) => {
//         request(downloadUrl)
//           .pipe(fileStream)
//           .on('finish', resolve)
//           .on('error', reject);
//       });

//       // Send the file as a document
//       await bot.sendDocument(chatId, fileName);

//       // Remove the file after sending
//       fs.unlinkSync(fileName);

//     } catch (error) {
//       console.error('Error downloading or sending the sticker:', error.message);
//       bot.sendMessage(chatId, 'Error downloading or sending the sticker.');
//     }
//   } else {
//     bot.sendMessage(chatId, 'Please reply to a sticker message to use this command.');
//   }
// });

// // Helper function to download the file
// async function downloadFile(fileId, dest) {
//   const file = await bot.getFile(fileId);
//   const url = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
  
//   return new Promise((resolve, reject) => {
//     const fileStream = fs.createWriteStream(dest);
//     bot.downloadFile(fileId, dest)
//       .then(() => {
//         resolve(dest);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// }

// bot.onText(/\/getsticker/, async (msg) => {
//   const chatId = msg.chat.id;
//   const reply = msg.reply_to_message;

//   // Check if the message is a reply to a sticker
//   if (reply && reply.sticker) {
//     const sticker = reply.sticker;
//     const fileId = sticker.file_id;
//     const dest = path.join(__dirname, `${fileId}.webp`);

//     try {
//       // Download the sticker file
//       await downloadFile(fileId, dest);
      
//       // Send the sticker file as a document
//       await bot.sendDocument(chatId, dest, { caption: 'Here is the sticker as a document.' });

//       // Clean up the downloaded file
//       fs.unlinkSync(dest);
//     } catch (error) {
//       console.error('Error downloading or sending the sticker:', error.message);
//       bot.sendMessage(chatId, 'Failed to get the sticker. Please try again later.');
//     }
//   } else {
//     bot.sendMessage(chatId, 'Please reply to a sticker with the command to get the sticker as a document.');
//   }
// });


// // dev commands message
// bot.onText(/\/dev/, async (msg) => { // Opening for the /dev command
//   let chatId = msg.chat.id;
//   if (String(msg.from.id) !== String(process.env.DEV_ID)) {
//     return bot.deleteMessage(msg.chat.id, msg.message_id);
//   }
//  const uptimeSeconds = os.uptime();
//   const formattedUptime = formatUptime(uptimeSeconds); // Use the formatUptime function from utils.js
//   const inlineKeyboard = [
//     [{
//       text: 'More >',
//       callback_data: 'more_info'
//     }],
//   ];

//   let response = await bot.sendPhoto(msg.chat.id, 'https://telegra.ph/file/4884da05334e8c173e835.jpg', {
//     caption: `*ʜᴇʟʟᴏ ʙᴀʙʏ ❤️*
  
//   \`> 2 + 2\`      \`$ ls\`
  
//   \`$ uptime\`     \`$ df -h\`
  
//   \`$ free -m\`    \`$ cat /etc/passwd\`
  
//   \`$ pwd\`        \`$ uname -a\`
  
//   \`$ top -bn1 | head -n 10\`
  
//   ~~~~ **ꜱʏꜱᴛᴇᴍ ᴜᴘᴛɪᴍᴇ:** ${formattedUptime} ~~~~ `,
//     reply_markup: {
//       inline_keyboard: inlineKeyboard
//     },
//     parse_mode: 'Markdown', // Ensure Markdown mode is enabled
//   });

//   // Handle button callback
//   bot.on('callback_query', async (callbackQuery) => { // Opening for callback_query handler
//     const chatId = callbackQuery.message.chat.id;
//     const messageId = callbackQuery.message.message_id;
//     const data = callbackQuery.data;

//     if (data === 'more_info') {
//       // Send additional information when the button is pressed
//       await bot.editMessageCaption(
//         `ᴏᴛʜᴇʀ ᴄᴏᴍᴍᴀɴᴅꜱ
//   /upload (Upload Speed)
//   /download (Download speed)
//   /senddb (Send Database)
//   /listfiles (List Files All Users)
//   /deletefiles (Delete Files Dev Only)\n
//   ~~~~ *ꜱʏꜱᴛᴇᴍ ᴜᴘᴛɪᴍᴇ:* ${formattedUptime} ~~~~ `, {
//           chat_id: chatId,
//           message_id: messageId,
//           reply_markup: {
//             inline_keyboard: [
//               // Add the "Back to first caption" button
//               [{
//                 text: '< Back',
//                 callback_data: 'back_to_first_caption'
//               }],
//             ],
//           },
//           parse_mode: 'Markdown', // Ensure Markdown mode is enabled
//         }
//       );
//     } else if (data === 'back_to_first_caption') {
//       // Handle the callback for the "Back to first caption" button
//       await bot.editMessageCaption(
//         `*ʜᴇʟʟᴏ ʙᴀʙʏ ❤️*
  
//   \`> 2 + 2\`      \`$ ls\`
  
//   \`$ uptime\`     \`$ df -h\`
  
//   \`$ free -m\`    \`$ cat /etc/passwd\`
  
//   \`$ pwd\`        \`$ uname -a\`
  
//   \`$ top -bn1 | head -n 10\`
  
//   ~~~~ **ꜱʏꜱᴛᴇᴍ ᴜᴘᴛɪᴍᴇ:** ${formattedUptime} ~~~~ `, {
//           chat_id: chatId,
//           message_id: messageId,
//           reply_markup: {
//             inline_keyboard: inlineKeyboard
//           },
//           parse_mode: 'Markdown', // Ensure Markdown mode is enabled
//         }
//       );
//     }
//   }); // Closing for callback_query handler

// }); // Closing for /dev command


// Command to delete all files for the chat (restricted to developer)
// bot.onText(/\/deletefiles/, async (msg) => {
//   const chatId = msg.chat.id;
//   const userId = msg.from.id;
//   const messageId = msg.message_id;

//   if (String(userId) !== String(process.env.DEV_ID)) {
//     // Delete the message if not from developer
//     return bot.deleteMessage(chatId, messageId);
//   }

//   const chatDir = `images/${chatId}`;

//   try {
//     if (fs.existsSync(chatDir)) {
//       const files = fs.readdirSync(chatDir);
//       files.forEach(file => fs.unlinkSync(path.join(chatDir, file)));
//       await bot.sendMessage(chatId, `All files have been deleted.`);
//     } else {
//       await bot.sendMessage(chatId, `No files found for this chat.`);
//     }
//   } catch (err) {
//     console.error('Error deleting files:', err.message);
//     await bot.sendMessage(chatId, `There was an error deleting the files.`);
//   }
// });


// Listen for photo messages
// Listen for photo messages
// bot.on('photo', (msg) => {
//   const chatId = msg.chat.id;
//   const photo = msg.photo[msg.photo.length - 1]; // Get the largest photo size

//   // Prepare inline keyboard options
//   const inlineKeyboard = {
//     inline_keyboard: [
//       [
//         {
//           text: 'Set as Group Photo',
//           callback_data: `setGroupPhoto:${chatId}:${photo.file_id}`
//         }
//       ]
//     ]
//   };

//   // Reply to the photo message with an inline keyboard
//   bot.sendMessage(chatId, 'Click the button below to set this photo as the group photo.', {
//     reply_markup: inlineKeyboard
//   }).then(() => {
//     console.log('Inline keyboard sent successfully');
//   }).catch(error => {
//     console.error('Error sending inline keyboard:', error.message);
//   });
// });

// // Handle inline keyboard callback
// bot.on('callback_query', async (callbackQuery) => {
//   const data = callbackQuery.data.split(':');
//   const command = data[0];
//   const chatId = data[1];
//   const photoFileId = data[2];

//   if (command === 'setGroupPhoto') {
//     try {
//       // Download the photo file
//       const photoFile = await bot.getFile(photoFileId);
//       const photoUrl = `https://api.telegram.org/file/bot${token}/${photoFile.file_path}`;
//       const response = await fetch(photoUrl);
//       const buffer = await response.buffer();

//       // Set the group chat photo
//       await bot.setChatPhoto(chatId, buffer);
//       await bot.answerCallbackQuery(callbackQuery.id, { text: 'Group chat photo has been updated successfully!', show_alert: true });
//     } catch (error) {
//       console.error('Error setting group chat photo:', error.message);
//       await bot.answerCallbackQuery(callbackQuery.id, { text: 'Failed to update group chat photo.', show_alert: true });
//     }
//   }
// });




// bot.onText(/\/info/, async (msg) => {
//   const chatId = msg.chat.id;
//   const userId = msg.from.id;
//   const caption = `◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}`;

//   try {

//     // Get the user's profile photos
//     // const profilePhotos = await bot.getUserProfilePhotos(userId);
//     // const photo = profilePhotos.photos.length > 0 ? profilePhotos.photos[0][0].file_id : null;
//      const profilePhotos = await bot.getUserProfilePhotos(userId);
//     const photos = profilePhotos.photos;

//     if (photos.length > 0) {
//       // Get the most recent profile photo
//       const recentPhoto = photos[0][0].file_id;

//       // Send the profile photo
//           await bot.sendPhoto(chatId, recentPhoto, { caption, parse_mode: 'Markdown' });
//     }}
//      catch (error) {
//     console.error('Error fetching user profile photos:', error.message);
//     bot.sendMessage(chatId, 'Failed to fetch user profile photos. Please try again later.');
//   }
// });
    // Construct user info caption
    // const caption = `
    //  ◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}
    // `;

    // Send the user's profile picture with the info caption
//     if (photo) {
//       await bot.sendPhoto(chatId, photo, { caption, parse_mode: 'Markdown' });
//     } else {
//       await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown' });
//     }
//   } catch (error) {
//     console.error('Error fetching user info:', error);
//     await bot.sendMessage(chatId, 'Failed to fetch your profile info. Please try again later.');
//   }


// Rest of your code...

bot.on('callback_query', async (mil) => {
  let data = mil.data;
  let url = data.split(' ').slice(1).join(' ');
  let chatid = mil.message.chat.id;
  let msgid = mil.message.message_id;
  let usrnm = mil.message.chat.username;
  let callbackQueryId = mil.id;
  if (data.startsWith('tta')) {
    await bot.deleteMessage(chatid, msgid);
    await tiktokAudio(bot, chatid, url, usrnm);
  } else if (data.startsWith('ttv')) {
    await bot.deleteMessage(chatid, msgid);
    await tiktokVideo(bot, chatid, url, usrnm);
  } else if (data.startsWith('tts')) {
    await bot.deleteMessage(chatid, msgid);
    await tiktokSound(bot, chatid, url, usrnm);
  } else if (data.startsWith('twh')) {
    await bot.deleteMessage(chatid, msgid);
    await downloadTwitterHigh(bot, chatid, usrnm);
  } else if (data.startsWith('twl')) {
    await bot.deleteMessage(chatid, msgid);
    await downloadTwitterLow(bot, chatid, usrnm);
  } else if (data.startsWith('twa')) {
    await bot.deleteMessage(chatid, msgid);
    await downloadTwitterAudio(bot, chatid, usrnm);
  } else if (data.startsWith('spt')) {
    await bot.deleteMessage(chatid, msgid);
    await getSpotifySong(bot, chatid, url, usrnm);
  } else if (data.startsWith('fbn')) {
    await bot.deleteMessage(chatid, msgid);
    await getFacebookNormal(bot, chatid, usrnm);
  } else if (data.startsWith('fbh')) {
    await bot.deleteMessage(chatid, msgid);
    await getFacebookHD(bot, chatid, usrnm);
  } else if (data.startsWith('fba')) {
    await bot.deleteMessage(chatid, msgid);
    await getFacebookAudio(bot, chatid, usrnm);
   }else if (data.startsWith('ytv')) {
    let args = url.split(' ');
    await bot.deleteMessage(chatid, msgid);
    await getYoutubeVideo(bot, chatid, args[0], args[1], usrnm);
  } else if (data.startsWith('yta')) {
    let args = url.split(' ');
    await bot.deleteMessage(chatid, msgid);
    await getYoutubeAudio(bot, chatid, args[0], args[1], usrnm);
 } else if (data.startsWith('tourl1')) {
    await bot.deleteMessage(chatid, msgid);
    await telegraphUpload(bot, chatid, url, usrnm);
  } else if (data.startsWith('tourl2')) {
    await bot.deleteMessage(chatid, msgid);
    await Pomf2Upload(bot, chatid, url, usrnm);
  } else if (data.startsWith('ocr')) {
    await bot.deleteMessage(chatid, msgid);
    await Ocr(bot, chatid, url, usrnm);
  } else if (data.startsWith('setGroupPhoto')) {
    await bot.deleteMessage(chatid, msgid);
    await setGroupPhoto(bot, chatid, url, usrnm, callbackQueryId);
  }
})

process.on('uncaughtException', console.error)
