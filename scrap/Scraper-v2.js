import axios from 'axios';
import cheerio from 'cheerio';

import { getBookItem, addBook } from '../services/BookService.js';
import { mongoDbConnect, mongoDbClose } from '../lib/MongoDConnect.js';
const scraper = async (url) => {
  const savedJson = []; //저장 완료된 책 데이터를 넣을 배열

  for (let page = 1; page < 4; page++) {
    //중복 데이터가 발견되지 않더라도 최대 3페이지 까지만 확인한다
    const pageJson = []; //저장하기 전 한 페이지의 책들을 넣을 배열
    console.log(page + '페이지..');

    let data = null;
    try {
      const res = await axios.get(`${url}?page=${page}`);
      data = res.data;
    } catch (err) {
      console.error(err);
    }
    const $ = cheerio.load(data);

    const bookMetaData = $('.book_macro_110.book_macro_portrait.book_macro_column_5');
    bookMetaData.each((i, data) => {
      //한 페이지의 책 데이터를 읽어들이기

      //제목
      const title = $(data).find('.title_text.js_highlight_helper').text().trim();

      //작가
      const tmp = $(data).find('.js_author_detail_link.author_detail_link');
      const author = [];
      tmp.each((i, v) => {
        author[i] = $(v).text().trim();
      });

      const path = $(data).find('a.thumbnail_btn.trackable').attr('href').split('?')[0];
      const id = path.split('/')[2];
      const url = 'https://ridibooks.com/books/' + id;
      const thumbnail = 'https://img.ridicdn.net/cover/' + id + '/xxlarge';

      //책 한 권
      const newBookItem = {
        title,
        author,
        url,
        thumbnail,
      };

      pageJson.push(newBookItem); //한 페이지의 책 정보가 모두 배열에 저장되었다
    });

    await mongoDbConnect(); //몽고 DB를 연결한다

    for (let i = 0; i < pageJson.length; i++) {
      const bookItem = pageJson[i];
      let duplicateBookItem = null;

      try {
        console.log(page + '페이지/' + (i + 1) + '번째 책 저장중...');

        duplicateBookItem = await getBookItem(bookItem.title, bookItem.author); //중복 검사

        if (duplicateBookItem !== null) {
          console.log('중복 데이터입니다');
          await mongoDbClose();
          return savedJson; //지금까지 저장한 데이터를 리턴
        }

        await addBook(bookItem); //db에 저장한다
        console.log(page + '페이지/' + (i + 1) + '번째 책 저장 완료');
        savedJson.push(bookItem); //db 저장에 성공한 책만 배열에 추가한다
      } catch (err) {
        console.error(err);
        continue; // db 에러 넘어가고 다음 책으로...
      }
    }
    //한 페이지 데이터를 모두 저장하고 다음 페이지로 넘어간다
    page++;
  }

  await mongoDbClose();
  return savedJson; //3페이지 까지만 저장된 데이터를 리턴
};

export default scraper;
