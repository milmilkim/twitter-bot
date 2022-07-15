import { book } from '../models/book.js';
import { mongoDbConnect, mongoDbClose } from '../lib/MongoDConnect.js';
import { deleteBooks } from '../services/BookService.js';

(async () => {
  try {
    //몽고디비 연결
    await mongoDbConnect();

    await deleteBooks();
  } catch (err) {
    console.error(err.message);
  } finally {
    //연결 해제
    await mongoDbClose();
  }
})();
