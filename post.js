/**
 * 매일 실행되는 파일임
 */

import scraper from './scrap/Scraper-v2.js';
import Bot from './twitter/Bot.js';

import dotenv from 'dotenv';

import generateTweetText from './lib/GenerateTweet.js';
import imageToBase64 from './lib/ImageToBase64.js';

dotenv.config();

const autoTweet = async (listUrl, accountInfo) => {
  const books = await scraper(listUrl);

  console.log(books);
  const bot = new Bot(); //새 봇 객체 만들기

  const { oauthToken, oauthSecret } = accountInfo;
  bot.init({
    oauthToken,
    oauthSecret,
  });

  for (let i = 0; i < books.length; i++) {
    const { thumbnail, title, author, url } = books[i];
    const encodedThumbnail = await imageToBase64(thumbnail);
    const res = await bot.uploadMedia(encodedThumbnail);
    const imageId = res.data.media_id_string;
    const text = generateTweetText(title, author, url);

    console.log(text);

    try {
      const tweet = await bot.addTweet({
        text,
        media: {
          media_ids: [imageId],
        },
      });

      console.log(tweet.data);
    } catch (err) {
      console.error(err);
      continue;
    }
  }
};

//계정 1호
const bot1 = {
  oauthToken: process.env.TWITTER_ACCESS_TOKEN,
  oauthSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
};

//계정 2호
const bot2 = {
  oauthToken: process.env.TWITTER_ACCESS_TOKEN_B,
  oauthSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET_B,
};

(async () => {
  await autoTweet(process.env.RIDI_URL_C, bot1);
  await autoTweet(process.env.RIDI_URL_B, bot2);
})();
