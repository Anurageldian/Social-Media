/* required to disable the deprecation warning, 
will be fixed when node-telegram-bot-api gets a new update */
require('dotenv').config()
process.env['NTBA_FIX_350'] = 1
let express = require('express');
let app = express();
let TelegramBot = require('node-telegram-bot-api')
let fs = require('fs')
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
  getBanned
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
  Ocr
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
let token = process.env.TOKEN
let bot = new TelegramBot(token, {
  polling: true
})
// Bot Settings
let botName = 'Nezuko Social Bot';
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
    await bot.deleteMessage(msg.chat.id, msg.message_id);
    let options = {
      caption: `Please select the following option`,
      reply_markup: JSON.stringify({
        inline_keyboard: [
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
        ]
      })
    }
    return bot.sendPhoto(chatId, `${write}`, options)
  } catch (err) {
    return bot.sendMessage(String(process.env.DEV_ID), `Error Image Process: ${err}`);
  }
})


// start
bot.onText(/\/start/, async (msg) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
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
`Hello I am ${botName}

Please send a link to the video or post you want to download, the bot only supports social media on the list

LIST :
• Threads
• Tiktok  
• Instagram
• Twitter  
• Facebook
• Pinterest
• Spotify
• Github`,
    reply_markup: { inline_keyboard: inlineKeyboard },
  });

  // Handle button callback
  bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;

    if (data === 'more_info') {
      // Send additional information when the button is pressed
      await bot.editMessageCaption(
        `OTHER FEATURES
        /ai (Question/Pertanyaan)
        /brainly (Pertanyaan/Soal)
        /pin (Searching Pinterest)
        /google (Searching Google)
        
Send images, if you want to use ocr (extract text on image), telegraph (upload to telegraph), and pomf2 (upload to pomf2)`,
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
        }
      );
    } else if (data === 'back_to_first_caption') {
      // Handle the callback for the "Back to first caption" button
      await bot.editMessageCaption(
`Hello I am ${botName}

Please send a link to the video or post you want to download, the bot only supports social media on the list

LIST :
• Threads
• Tiktok  
• Instagram
• Twitter  
• Facebook
• Pinterest
• Spotify
• Github`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: { inline_keyboard: inlineKeyboard },
        }
      );
    }
  });



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

// send database
bot.onText(/\/senddb/, async (msg) => {
  if (String(msg.from.id) !== String(process.env.DEV_ID)) {
    return
  }
  await bot.sendDocument(msg.chat.id, "./database.json")
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await getTiktokInfo(bot, msg.chat.id, msg.text, msg.chat.username);
  } finally {
    userLocks[userId] = false;
  }
})

// Twitter Regex
bot.onText(/https?:\/\/(?:.*\.)?twitter\.com/, async (msg) => {
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned\n\nReason : ${getban.reason}\n\nDo you want to be able to use bots again? Please contact the owner to request removal of the ban\nOwner : @firespower`)
  let userId = msg.from.id.toString();
  if (userLocks[userId]) {
    return;
  }
  userLocks[userId] = true;
  try {
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await getAlbumsSpotify(bot, msg.chat.id, match[0], msg.chat.username)
  } finally {
    userLocks[userId] = false;
  }
})

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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
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
    await bot.sendMessage(String(process.env.DEV_ID), `[ Usage Log ]\n◇ FIRST NAME : ${msg.from.first_name ? msg.from.first_name : "-"}\n◇ LAST NAME : ${msg.from.last_name ? msg.from.last_name : "-"}\n◇ USERNAME : ${msg.from.username ? "@" + msg.from.username : "-"}\n◇ ID : ${msg.from.id}\n\nContent: ${msg.text.slice(0, 1000)}`, { disable_web_page_preview: true })
    await gitClone(bot, msg.chat.id, match[0], msg.chat.username)
  } finally {
    userLocks[userId] = false;
  }
})

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



bot.onText(/\/getprofilepics/, async (msg) => {
  const chatId = msg.chat.id;

  // Get the user ID of the user who sent the message
  const userId = msg.from.id;

  try {
    // Call the getUserProfilePhotos method to get the user's profile pictures
    const userProfilePhotos = await bot.getUserProfilePhotos(userId);

    // Extract the list of photos from the response
    const photos = userProfilePhotos.photos;

    // Send a message with the number of profile pictures and their details
    bot.sendMessage(chatId, `User ${userId} has ${photos.length} profile pictures:`);

    // Loop through each photo and send it to the chat
    photos.forEach((photo, index) => {
      // Send each photo as a separate message
      bot.sendPhoto(chatId, photo[0].file_id, { caption: `Photo ${index + 1}` });
    });
  } catch (error) {
    console.error('Error fetching user profile photos:', error.message);
    bot.sendMessage(chatId, 'Failed to fetch user profile photos. Please try again later.');
  }
});

// Rest of your code...

bot.on('callback_query', async (mil) => {
  let data = mil.data;
  let url = data.split(' ').slice(1).join(' ');
  let chatid = mil.message.chat.id;
  let msgid = mil.message.message_id;
  let usrnm = mil.message.chat.username;
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
  } else if (data.startsWith('ytv')) {
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
  }
})

process.on('uncaughtException', console.error)
