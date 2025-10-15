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
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};
app.use(cors(corsOptions)); // Use the new cors options
app.use(express.json()); // Enable parsing of JSON request bodies


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