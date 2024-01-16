const axios = require('axios');
const cheerio = require('cheerio');

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

async function getBanned(user) {
    try {
      let get = await axios.get(`https://raw.githubusercontent.com/Krxuv/list_banned/main/banned.json`)
      let json = get.data;
      let idget = json.find(item => item.id == user);
      if (idget) {
        return {
          status: false,
          reason: idget.reason
        }
      } else {
        return {
          status: true
        }
      }
    } catch (err) {
      console.log(err)
      return {
        status: true
      }
    }
  }


module.exports = {
  getBuffer,
  htmlToText,
  filterAlphanumericWithDash,
  getRandom,
  getBanned
}
