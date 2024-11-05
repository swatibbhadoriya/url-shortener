const express = require('express');
const {
  createShortURL, getUserURLs, trackURL, updateURL, deleteURL
} = require('../controllers/urlController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/shorten', authMiddleware, createShortURL);
router.get('/urls', authMiddleware, getUserURLs);
router.get('/:short_url', trackURL);
router.put('/:short_url', authMiddleware, updateURL);
router.delete('/:short_url', authMiddleware, deleteURL);

module.exports = router;
