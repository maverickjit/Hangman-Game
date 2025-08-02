const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend from 'public'
app.use(express.static(path.join(__dirname, 'Public')));

const WORDS = [ /* your word list here */ ];
app.get('/word', (req, res) => {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  res.json({ word });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
