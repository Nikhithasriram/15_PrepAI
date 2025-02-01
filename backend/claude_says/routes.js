
const express = require('express');
const router = express.Router();
const { generateText } = require('./modelController');

router.post('/generate', generateText);

module.exports = router;