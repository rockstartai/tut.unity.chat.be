const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // improve compatibility with WebGL

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = 3000;
const MAX_MESSAGES = 10000;

let messages = [];

app.get('/messages', (req, res) => {
  const timestamp = req.query.timestamp;

  let filteredMessages = messages;

  // If a timestamp is provided, filter messages to only those after the given timestamp.
  if (timestamp) {
    filteredMessages = filteredMessages.filter(message => message.timestamp > Number(timestamp));
  }

  res.json(filteredMessages);
});

app.post('/message', (req, res) => {
  const { username, text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required.' });
  }

  messages.push({ username, text, timestamp: Date.now() });

  // If the messages exceed 10k, remove the oldest ones.
  while (messages.length > MAX_MESSAGES) {
    messages.shift();
  }

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});