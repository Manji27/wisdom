const express = require('express');
const router = express.Router();

// GET /
router.get('/', (req, res) => {
  res.send('Welcome to the index page');
});

module.exports = router;
