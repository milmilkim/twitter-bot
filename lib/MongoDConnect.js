import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const mongodbUrl = process.env.MONGODB_URL;

export const mongoDbConnect = async () => {
  try {
    console.log(mongodbUrl);

    await mongoose.connect('mongodb+srv://' + mongodbUrl);
    console.log('mongodb 연결 완료');
  } catch (err) {
    console.log('연결 실패');
    console.error(err);
  }
};

export const mongoDbClose = async () => {
  try {
    await mongoose.disconnect();
    console.log('mongodb 연결 해제');
  } catch (err) {
    console.log('연결 해제 실패');
    console.error(err);
  }
};
