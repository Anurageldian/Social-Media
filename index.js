/* required to disable the deprecation warning, 
will be fixed when node-telegram-bot-api gets a new update */
require('dotenv').config()
process.env['NTBA_FIX_350'] = 1
let express = require('express');
const { formatUptime } = require('./funcs/utils'); // Import the formatUptime function from utils.js
const os = require('os');
const { execSync } = require('child_process');
let app = express();
let TelegramBot = require('node-telegram-bot-api')
let fs = require('fs')
const path = require('path');
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
  Ocr,
  setGroupPhoto
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
    await bot.deleteMessage(msg.chat.id, msg.message_id);
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
    return bot.sendMessage(String(process.env.DEV_ID), `Error Image Process: ${err}`);
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
bot.onText(/https?:\/\/(?:.*\.)?(twitter\.com|x\.com)/, async (msg) => {
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


// Command: Ban User

bot.onText(/\/ban (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
     bot.banChatMember(msg.chat.id, msg.from.id);
       bot.sendMessage(chatId, `User ${userId} banned.`);
  });
// iikkk
//   if (input.startsWith('@')) {
//     // Input is a username
//     const username = input.slice(1);
//     try {
//       const chatMembers = await bot.getChatAdministrators(chatId);
//       const user = chatMembers.find(member => member.user.username === username);
//       if (user) {
//         await banUser(user.user.id);
//       } else {
//         sendMessage(`User @${username} not found.`);
//       }
//     } catch (error) {
//       sendMessage(`Failed to get chat members: ${error.message}`);
//     }
//   } else {
//     // Input is a user ID
//     const userId = parseInt(input, 10);
//     if (isNaN(userId)) {
//       sendMessage(`Invalid user ID: ${input}`);
//     } else {
//       await banUser(userId);
//     }
//   }
// });

// // Error handling
// bot.on('polling_error', (error) => {
//   console.error(`Polling error: ${error.code} - ${error.message}`);
// });


// Command: Unban User
bot.onText(/\/unban (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];

  bot.unbanChatMember(chatId, userId)
    .then(() => bot.sendMessage(chatId, `User ${userId} unbanned.`))
    .catch(error => bot.sendMessage(chatId, `Failed to unban user: ${error}`));
});

// Command: Kick User
bot.onText(/\/kick (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];

  bot.kickChatMember(chatId, userId)
    .then(() => bot.sendMessage(chatId, `User ${userId} kicked.`))
    .catch(error => bot.sendMessage(chatId, `Failed to kick user: ${error}`));
});

// Command: Change Group Picture
bot.onText(/\/setgrouppic/, (msg) => {
  const chatId = msg.chat.id;
  const photo = msg.photo[msg.photo.length - 1].file_id; // Assume last photo is highest resolution

  bot.setChatPhoto(chatId, photo)
    .then(() => bot.sendMessage(chatId, `Group picture changed.`))
    .catch(error => bot.sendMessage(chatId, `Failed to change group picture: ${error}`));
});

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




// Event listener for /info command


function escapeMarkdown(text) {
  return text.replace(/(\*|_|`|\[|\])/g, '\\$1');
}

bot.onText(/\/info/, async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  const userId = user.id;
  const userLink = `[Link](tg://user?id=${userId})`;

  try {
    // Fetch the user's profile photos
    const profilePhotos = await bot.getUserProfilePhotos(userId);
    const photos = profilePhotos.photos;

    // Get user information
    const username = user.username ? `@${escapeMarkdown(user.username)}` : 'none';
    const firstName = escapeMarkdown(user.first_name);
    const lastName = user.last_name ? escapeMarkdown(user.last_name) : '⚡';

    // Construct caption
    const caption = `
      ✦ ᴜsᴇʀ ɪɴғᴏʀᴍᴀᴛɪᴏɴ ✦
•❅─────✧❅✦❅✧─────❅•
 ➻ ғɪʀsᴛ ɴᴀᴍᴇ:  ${firstName} ${lastName}
 ➻ ᴜsᴇʀɴᴀᴍᴇ:  ${username}
 ➻ ᴜsᴇʀ ɪᴅ:  \`${userId}\`
 ➻ ʟɪɴᴋ:  ${userLink}
    `;

    if (photos.length > 0) {
      // Get the most recent profile photo
      const recentPhoto = photos[0][0].file_id;

      // Send the profile photo with user info
      await bot.sendPhoto(chatId, recentPhoto, { caption, parse_mode: 'Markdown' });
    } else {
      // No profile photos found, send only user info
      await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown' });
    }
  } catch (error) {
    console.error('Error fetching user profile photos:', error.message);
    await bot.sendMessage(chatId, 'Failed to fetch user profile photos. Please try again later.');
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





bot.onText(/\/dev/, async (msg) => {
  let chatId = msg.chat.id;
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
      await bot.deleteMessage(msg.chat.id, msg.message_id, messageId);
    }
  })
});

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
  } else if (data.startsWith('setGroupPhoto')) {
    await bot.deleteMessage(chatid, msgid);
    await setGroupPhoto(bot, chatid, url, usrnm, callbackQueryId);
  }
})

process.on('uncaughtException', console.error)
