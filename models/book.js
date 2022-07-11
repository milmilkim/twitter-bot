import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const book = model('book', bookSchema);

export { book };
