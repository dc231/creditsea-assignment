// Import required packages
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
connectDB();

// Initialize the express app
const app = express();
const PORT = process.env.PORT || 5001; 

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// A simple test route to check if the server is running
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the CreditSea API!' });
});

// Import routes
const reportRoutes = require('./routes/reportRoutes');

// Start the server
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});

// Use routes
app.use('/api', reportRoutes);