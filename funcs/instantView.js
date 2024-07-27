require('dotenv').config()
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const util = require('util');
const fetch = require('node-fetch');

async function getHTML(url) {
  url = encodeURI(url);
  const res = await fetch(url, { headers: { 'User-Agent': 'Web/2.0' } });
  const body = await res.text();
  const $ = cheerio.load(body);
  const html = {
    body: $('body').html(),
    bodyClasses: $('body').attr('class')
  };

  if ($('style')) {
    html['inline-css'] = [];
    $('style').each((i, el) => {
      html['inline-css'].push($(el).html());
    });
  }

  if ($('link[type="text/css"]')) {
    html['link-css'] = [];
    $('link[type="text/css"]').each((i, el) => {
      html['link-css'].push($(el).attr('href'));
    });
  }

  if ($('link[rel="stylesheet"]')) {
    if (!html['link-css']) html['link-css'] = [];
    $('link[rel="stylesheet"]').each((i, el) => {
      if ($(el).attr('type') !== 'text/css') {
        html['link-css'].push($(el).attr('href'));
      }
    });
  }

  return html;
}

async function generateTpl(url) {
  url = encodeURI(url);
  const res = await fetch(url, { headers: { 'User-Agent': 'Web/2.0' } });
  const body = await res.text();
  const $ = cheerio.load(body);
  let results = '';
  const checklist = {
    title: false,
    body: false,
    cover: false,
    published_date: false,
    author: false,
    description: false
  };

  if ($('meta[property="og:title"]').length > 0) {
    results += 'title: //meta[@property="og:title"]/@content\n';
    checklist.title = true;
  }

  if ($('meta[property="twitter:title"]').length > 0) {
    results += 'title: //meta[@property="twitter:title"]/@content\n';
    checklist.title = true;
  }

  if ($('title')) {
    results += 'title: //title\n';
    checklist.title = true;
  }

  if ($('div[itemtype="http://schema.org/Article"]').length > 0) {
    results += 'body: //div[@itemtype="http://schema.org/Article"]\n';
    checklist.body = true;
  }

  if ($('article').length > 0) {
    results += 'body: //article\n';
    checklist.body = true;
  }

  if ($('meta[property="og:image"]').length > 0) {
    results += '@replace_tag(<img>): //meta[@property="og:image"]\n';
    results += '@set_attr(src, @content): //img[@property="og:image"]\n';
    results += 'cover: //img[@property="og:image"]\n';
    checklist.cover = true;
  }

  if ($('meta[property="twitter:image"]').length > 0) {
    results += '@replace_tag(<img>): //meta[@property="twitter:image"]\n';
    results += '@set_attr(src, @content): //img[@property="twitter:image"]\n';
    results += 'cover: //img[@property="twitter:image"]\n';
    checklist.cover = true;
  }

  if ($('meta[itemprop="image"]').length > 0) {
    results += '@replace_tag(<img>): //meta[@itemprop="image"]\n';
    results += '@set_attr(src, @content): //img[@itemprop="image"]\n';
    results += 'cover: //img[@itemprop="image"]';
    checklist.cover = true;
  }

  if ($('img[itemprop="image"]').length > 0) {
    results += 'cover: //img[@itemprop="image"]\n';
    checklist.cover = true;
  }

  if ($('img[itemprop="image url"]').length > 0) {
    results += 'cover: //img[@itemprop="image url"]\n';
    checklist.cover = true;
  }

  if ($('meta[property="article:published_time"]').length > 0) {
    results += 'published_date: //meta[@property="article:published_time"]/@content\n';
    checklist.published_date = true;
  }

  if ($('meta[property="article:published_date"]').length > 0) {
    results += 'published_date: //meta[@property="article:published_date"]/@content\n';
    checklist.published_date = true;
  }

  if ($('meta[property="article:author"]').length > 0) {
    results += 'author: //meta[@property="article:author"]/@content\n';
    checklist.author = true;
  }

  if ($('meta[property="og:description"]').length > 0) {
    results += 'description: //meta[@property="og:description"]/@content\n';
    checklist.description = true;
  }

  results += 'image_url: $cover\n';

  return { tpl: results, checklist: checklist };
}

module.exports = { getHTML, generateTpl };
