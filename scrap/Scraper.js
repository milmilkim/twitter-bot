import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import dotenv from 'dotenv';

import { getBookItem, addBook } from '../services/BookService.js';
import { mongoDbConnect, mongoDbClose } from '../lib/MongoDConnect.js';
import generateTweetText from '../lib/GenerateTweet.js';
import imageToBase64 from '../lib/ImageToBase64.js';

import Bot from '../twitter/Bot.js';

dotenv.config();

console.log(process.env.TWITTER_ACEESS_TOKEN_SECRET);
export const scrapNewBooks = async () => {
  const bot = new Bot();

  bot.init({
    oauthToken: process.env.TWITTER_ACCESS_TOKEN,
    oauthSecret: process.env.TTWITTER_ACEESS_TOKEN_SECRET,
  });

  await mongoDbConnect();
  const ridiId = process.env.RIDI_ID;
  const ridiPw = process.env.RIDI_PASSWORD;

  const ridiUrl = 'https://ridibooks.com/new-releases/comic?type=total';

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // 새로운 페이지를 연다.
    const page = await browser.newPage();

    await page.goto('https://ridibooks.com/account/login', { waitUntil: ['networkidle0'] });
    await page.waitForTimeout(500);

    await page.evaluate(
      (id, pw) => {
        document.querySelector('input[id="login_id"]').value = id;
        document.querySelector('input[id="login_pw"]').value = pw;
      },
      ridiId,
      ridiPw
    );
    //아이디와 비밀번호를 폼에 입력

    await page.click('.login-button');
    //로그인 버튼 클릭

    await page.waitForTimeout(500);
    //기다리시오

    console.log(ridiId);
    console.log('로그인함');

    let pageNum = 1;
    while (true) {
      if (pageNum > 2) {
        break;
      }

      await page.goto(ridiUrl + '&page=' + pageNum);

      const bookList = await page.content();
      const $ = cheerio.load(bookList);

      /* 제목 */
      const titleArray = [];
      const title = $('.title_text.js_highlight_helper');
      title.each((i, v) => {
        titleArray[i] = $(v).text().trim();
      });

      /* 주소 */
      const urlList = [];
      const thumbnail_btn = $('a.thumbnail_btn.trackable');
      const btns = Array.from(thumbnail_btn);
      btns.map((v, i) => (urlList[i] = 'https://ridibooks.com' + v.attribs.href.split('?')[0]));

      for (let i = 0; i < urlList.length; i++) {
        //책 개별 데이터
        await page.goto(urlList[i]);
        const book = await page.content();

        if (book === null) {
          throw new Error('데이터가 없음');
        }

        const $ = cheerio.load(book);

        const data = {};

        const thumbnail = $('img.thumbnail').attr('src');
        const title = titleArray[i];
        const author = [];
        const authors = $('a.js_author_detail_link.author_detail_link');
        authors.each((i, v) => {
          author[i] = $(v).text();
        }); //작가가 여러명일 수도 있음

        let bookItem = null;
        bookItem = await getBookItem(title, author);

        if (bookItem !== null) {
          console.log('이미 있는 책임');
          await browser.close();
          await mongoDbClose();
          return;
        }

        data.thumbnail = thumbnail;
        data.title = title;
        data.author = author;
        data.url = urlList[i];

        addBook(data); //db에 저장

        const encodedThumbnail = await imageToBase64(`https:${thumbnail}`);
        const res = await bot.uploadMedia(encodedThumbnail);
        const imageId = res.data.media_id_string;

        const text = generateTweetText(data.title, data.author, data.url);

        const tweet = await bot.addTweet({
          text,
          media: {
            media_ids: [imageId],
          },
        });

        console.log(tweet.data);
      } //for end

      pageNum += 1;
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoDbClose();
    await browser.close();
    return;
  }
};
