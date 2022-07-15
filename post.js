/**
 * 매일 실행되는 파일임
 */

import scraper from './scrap/Scraper-v2.js';
import Bot from './twitter/Bot.js';

import dotenv from 'dotenv';

import generateTweetText from './lib/GenerateTweet.js';
import imageToBase64 from './lib/ImageToBase64.js';

dotenv.config();

(async () => {
  const url = 'https://ridibooks.com/new-releases/comic';
  const books = await scraper(url);

  const bot = new Bot();
  bot.init({
    oauthToken: process.env.TWITTER_ACCESS_TOKEN,
    oauthSecret: process.env.TTWITTER_ACEESS_TOKEN_SECRET,
  });

  for (let i = 0; i < books.length; i++) {
    const { thumbnail, title, author } = books[i];
    const encodedThumbnail = await imageToBase64(thumbnail);
    const res = await bot.uploadMedia(encodedThumbnail);
    const imageId = res.data.media_id_string;
    const text = generateTweetText(title, author, url);

    try {
      const tweet = await bot.addTweet({
        text,
        media: {
          media_ids: [imageId],
        },
      });

      console.log(tweet);
    } catch (err) {
      console.error(err);
      continue;
    }
  }
  console.log('프로그램 종료 ^-^');
})();
