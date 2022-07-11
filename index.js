import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();
console.log(process.env.MONGODB_URL);

const mongodbUrl = process.env.MONGODB_URL;

// try {
//   await mongoose.connect('mongodb://' + mongodbUrl);
//   console.log('mongodb 연결 완료');
// } catch (err) {
//   console.error(err);
// }

const app = express();
app.set('port', 3000);

app.use('/', (req, res) => {
  res.send('hello world!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('listen to ' + app.get('port'));
});
