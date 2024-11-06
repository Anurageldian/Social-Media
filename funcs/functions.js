const axios = require('axios');
const cheerio = require('cheerio');
const bannedJsonPath = require('./banned.json');
async function getRandom(ext) {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

async function getBuffer(url) {
  try {
    let data = await axios({
      method: 'get',
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Requests': 1
      },
      responseType: 'arraybuffer'
    })
    return data.data
  } catch (err) {
    console.log(err);
    return err
  }
}

function filterAlphanumericWithDash(inputText) {
  return inputText.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
}

function htmlToText(html) {
  let $ = cheerio.load(html);
  return $.text();
}

// async function getBanned(user) {
//     try {
//       let get = await axios.get(`https://raw.githubusercontent.com/Anurageldian/list_banned/main/banned.json`)
//       let json = get.data;
//       let idget = json.find(item => item.id == user);
//       if (idget) {
//         return {
//           status: false,
//           reason: idget.reason
//         }
//       } else {
//         return {
//           status: true
//         }
//       }
//     } catch (err) {
//       console.log(err)
//       return {
//         status: true
//       }
//     }
//   }

// Function to get banned users
async function getBanned(user) {
  try {
    let json = await getBannedList();
    let idget = json.find(item => item.id == user);
    if (idget) {
      return {
        status: false,
        reason: idget.reason
      };
    } else {
      return {
        status: true
      };
    }
  } catch (err) {
    console.log(err);
    return {
      status: true
    };
  }
}

// Function to get the current banned list from the local JSON file
async function getBannedList() {
  try {
    const data = fs.readFileSync(bannedJsonPath);
    return JSON.parse(data);
  } catch (err) {
    return []; // Return an empty array if the file doesn't exist
  }
}

// Add user to banned list
async function blockUser(userId, reason) {
  try {
    // Get the existing banned list
    let json = await getBannedList();

    // Check if the user is already banned
    if (json.find(item => item.id == userId)) {
      return 'User is already banned.';
    }

    // Add the user to the banned list
    json.push({
      id: userId,
      reason: reason
    });

    // Save the updated banned list to the local JSON file
    await saveBannedList(json);
    return 'User has been successfully blocked.';

  } catch (err) {
    console.error(err);
    return 'An error occurred while blocking the user.';
  }
}

// Remove user from banned list
async function unblockUser(userId) {
  try {
    // Get the existing banned list
    let json = await getBannedList();

    // Filter out the banned user
    const updatedJson = json.filter(item => item.id !== userId);

    if (updatedJson.length === json.length) {
      return 'User was not found in the banned list.';
    }

    // Save the updated banned list to the local JSON file
    await saveBannedList(updatedJson);
    return 'User has been successfully unblocked.';

  } catch (err) {
    console.error(err);
    return 'An error occurred while unblocking the user.';
  }
}

// Function to save the updated banned list to the local JSON file
async function saveBannedList(updatedJson) {
  try {
    fs.writeFileSync(bannedJsonPath, JSON.stringify(updatedJson, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to banned.json:', err);
  }
}


module.exports = {
  getBuffer,
  htmlToText,
  filterAlphanumericWithDash,
  getRandom,
  getBanned,
  blockUser,
  unblockUser
    
}
