const express = require('express');
const router = express.Router();

const { getNews, getSources } = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getNews);
router.get('/sources', authMiddleware, getSources);

module.exports = router;