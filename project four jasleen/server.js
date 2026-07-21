const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
// Reading environment variable with fallback
const APP_ENV = process.env.APP_ENV || 'Development';

// Middleware
app.use(cors());
app.use(express.json()); // JSON parsing middleware

// Simple Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static frontend files from 'public' directory
app.use(express.static('public'));

// In-Memory Data Store
let items = [
  { id: 1, action: "Dashboard profile initialized", category: "system", timestamp: Date.now() - 60000 },
  { id: 2, action: "Loaded default template theme settings", category: "system", timestamp: Date.now() }
];

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// GET /api/items - Retrieve all activity items
app.get('/api/items', (req, res) => {
  res.status(200).json({
    status: 'success',
    environment: APP_ENV,
    data: items
  });
});

// POST /api/items - Create a new activity item
app.post('/api/items', (req, res) => {
  const { action, category } = req.body;

  if (!action) {
    return res.status(400).json({
      status: 'error',
      message: 'Action field is required.'
    });
  }

  const newItem = {
    id: Date.now(),
    action: action.trim(),
    category: category || 'profile',
    timestamp: Date.now()
  };

  items.push(newItem);

  res.status(201).json({
    status: 'success',
    environment: APP_ENV,
    data: newItem
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in [${APP_ENV}] mode on port ${PORT}`);
});