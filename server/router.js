const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Rio chat server is up and running!');
});

module.exports = router;