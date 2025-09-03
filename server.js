const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎯 Alnership Minecraft Server running on http://0.0.0.0:${PORT}`);
  console.log('⛏️ Welcome to the pixelated world!');
});