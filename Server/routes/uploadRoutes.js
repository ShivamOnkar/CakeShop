const express = require("express");
const multer = require("multer");
const imagekit = require("../utils/imagekit");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer, // buffer directly from multer
      fileName: req.file.originalname,
    });

    res.json({
      message: "✅ Image uploaded successfully",
      url: uploadResponse.url,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Image upload failed",
      error: error.message,
    });
  }
});

module.exports = router;
