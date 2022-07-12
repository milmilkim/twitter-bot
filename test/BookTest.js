import { book } from '../models/book.js';
import { mongoDbConnect, mongoDbClose } from '../lib/MongoDConnect.js';

(async () => {
  let bookItems = null;
  try {
    //몽고디비 연결
    await mongoDbConnect();
    // book.deleteMany();

    // for (let i = 0; i < 30; i++) {
    //   await book.create({
    //     title: `${i}번째 책`,
    //     author: ['시나모롤'],
    //     url: 'http://naver.com',
    //   });
    // }

    // bookItems = await book
    //   .find()
    //   .sort({
    //     createdAt: -1,
    //   })
    //   .limit(30);
    // console.log(bookItems);

    // bookItems = await book.findOne({
    //   title: '99번째 책',
    //   author: ['시나모롤'],
    // });

    await book.deleteOne();

    console.log(bookItems);
  } catch (err) {
    console.error(err.message);
  } finally {
    //연결 해제
    await mongoDbClose();
  }
})();
