const express = require('express');
const multer = require('multer');
const { uploadAndProcessReport } = require('../controllers/reportController');

const router = express.Router();

// Configure Multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/xml' || file.mimetype === 'application/xml') {
            cb(null, true);
        } else {
            cb(new Error('Only XML files are allowed!'), false);
        }
    }
});

// Define the POST route for file upload
// The string 'reportFile' must match the key in the form-data from the frontend
router.post('/upload', upload.single('reportFile'), uploadAndProcessReport);

module.exports = router;