import { book } from '../models/book.js';

export const getCurrentBookItems = async (count) => {
  let bookItems = null;
  try {
    bookItems = await book
      .find()
      .sort({
        createdAt: -1,
      })
      .limit(count);
    return bookItems;
  } catch (err) {
    console.error(err);
  }
};

export const getBookItem = async (title, author) => {
  let bookItem = null;
  try {
    bookItem = await book.findOne({
      title,
      author,
    });
    return bookItem;
  } catch (err) {
    console.error(err);
  }
};

export const addBook = async (data) => {
  try {
    await book.create(data);
    return { result: 'ok' };
  } catch (err) {
    console.error(err);
  }
};

export const deleteBook = async () => {
  try {
    await book.deleteOne();
    return { result: 'ok' };
  } catch (err) {
    console.error(err);
  }
};

export const countBooks = async () => {
  let count = null;
  try {
    count = await book.countDocuments();
    return count;
  } catch (err) {
    console.error(err);
  }
};
