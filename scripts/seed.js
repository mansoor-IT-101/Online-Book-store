// scripts/seed.js
// Load sample books into MongoDB using the existing Book model

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Book = require(path.resolve(__dirname, '../models/Book'));

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    const books = require(path.resolve(__dirname, '../data/books.json'));

    // Clear existing collection (optional)
    await Book.deleteMany({});
    const inserted = await Book.insertMany(books);
    console.log(`Inserted ${inserted.length} books`);
  } catch (err) {
    console.error('Seeding failed:', err.message || err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
