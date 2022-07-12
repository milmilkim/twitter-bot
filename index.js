import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { book } from './models/book.js';

dotenv.config();

const mongodbUrl = process.env.MONGODB_URL;

(async () => {
  try {
    await mongoose.connect('mongodb+srv://' + mongodbUrl);
    console.log('mongodb 연결 완료');
  } catch (err) {
    console.log('연결 실패');
    console.error(err);
  }
})();

const app = express();
app.set('port', 3000);

app.use('/', async (req, res) => {
  try {
    const bookItem = await book.find();

    res.send(bookItem);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(app.get('port') + '번 포트에서 대기중...');
});
