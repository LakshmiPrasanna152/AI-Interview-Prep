const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { run } = require('../config/db');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file && !req.body.text) return res.status(400).json({ error: 'Resume file or text required' });
    let resumeText = req.body.text || '';
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        try {
          const pdfParse = require('pdf-parse');
          const data = await pdfParse(req.file.buffer);
          resumeText = data.text;
        } catch (e) {
          resumeText = req.file.buffer.toString('utf-8');
        }
      } else {
        resumeText = req.file.buffer.toString('utf-8');
      }
    }
    run('UPDATE users SET resume_text = ? WHERE id = ?', [resumeText.substring(0, 10000), req.user.id]);
    res.json({ message: 'Resume uploaded successfully', length: resumeText.length });
  } catch (err) {
    res.status(500).json({ error: 'Resume upload failed' });
  }
});

router.delete('/', protect, (req, res) => {
  try {
    run("UPDATE users SET resume_text = '' WHERE id = ?", [req.user.id]);
    res.json({ message: 'Resume removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove resume' });
  }
});

module.exports = router;
