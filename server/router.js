const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Rio chat server is up and running!');
});

module.exports = router;