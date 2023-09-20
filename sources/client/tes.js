                                             
const express = require('express');
const request = require('request');
require('dotenv').config();
const https = require('https');
const fs = require('fs');

const app = express();
const port = 443;

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/submit', (req, res) => {
    const result = JSON.parse(Object.keys(req.body)[0]);
    const name = result.name;
    const phone = result.phone;
    const comment = result.comment;
    sendToTelegram(name, phone, comment);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.send('Message sent successfully');
});

function sendToTelegram(name, phone, comment) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const message = `Name: ${name}\nPhone: ${phone}\nComment: ${comment}`;

  const url = "https://api.telegram.org/bot${botToken}/sendMessage";

  request.post(url, { form: { chat_id: chatId, text: message } }, (error, response, body) => {
    if (error) {
      console.error('Error sending message to Telegram:', error);
    } else if (response.statusCode !== 200) {
      console.error('Failed to send message to Telegram. Status code:', response.statusCode);
    } else {
      console.log('Message sent successfully');
    }
  });
}

const options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
};

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
