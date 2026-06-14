// server.js
// Main entry point for the Online Bookstore API

const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const dotenv     = require('dotenv');
const logger     = require('./middleware/logger');
const bookRoutes = require('./routes/books');

// Load environment variables from .env file
dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5001;

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────

// Parse incoming JSON requests
app.use(express.json());
app.use(bodyParser.json());

// Custom request logger middleware
app.use(logger);

// ─────────────────────────────────────────────
// DATABASE CONNECTION
// ─────────────────────────────────────────────
// Robust MongoDB connection with retries and sensible timeouts
const mongooseConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10s
};

async function connectWithRetry(attempt = 1, maxAttempts = 5) {
  try {
    await mongoose.connect(process.env.MONGO_URI, mongooseConnectOptions);
    console.log('✅  MongoDB connected successfully');
  } catch (err) {
    console.error(`❌  MongoDB connection attempt ${attempt} failed:`, err.message);
    if (attempt < maxAttempts) {
      const delay = 5000; // 5 seconds
      console.log(`Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxAttempts})`);
      setTimeout(() => connectWithRetry(attempt + 1, maxAttempts), delay);
    } else {
      console.error('Exceeded max MongoDB connection attempts. Exiting.');
      process.exit(1);
    }
  }
}

connectWithRetry();

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err && err.message ? err.message : err);
});

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Online Bookstore API 📚',
    endpoints: {
      getAllBooks:    'GET    /api/books',
      getBookById:   'GET    /api/books/:id',
      searchBooks:   'GET    /api/books?author=xyz&genre=abc',
      addBook:       'POST   /api/books',
      updateBook:    'PUT    /api/books/:id',
      deleteBook:    'DELETE /api/books/:id',
    },
  });
});

// Book routes
app.use('/api/books', bookRoutes);

// Health check — reports DB connection state
app.get('/health', (req, res) => {
  const readyState = mongoose.connection.readyState; // 0 disconnected,1 connected,2 connecting,3 disconnecting
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const state = stateMap[readyState] || readyState;
  const statusCode = readyState === 1 ? 200 : 503;
  res.status(statusCode).json({
    success: readyState === 1,
    dbState: state,
  });
});

// ─────────────────────────────────────────────
// GLOBAL ERROR HANDLERS
// ─────────────────────────────────────────────

// 404 — Route not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// 500 — Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
});
