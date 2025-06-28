// routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Configuration multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Route POST /upload
router.post('/upload', upload.single('image'), (req, res) => {
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

module.exports = router;
