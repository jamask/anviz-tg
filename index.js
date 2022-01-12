const TelegramBot = require('node-telegram-bot-api');

const token = '5018400836:AAHw90GzgFBkAdVXiYSgTPyBdMDfCg1BGDk';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg, _) => {
  const chatId = msg.chat.id;

  const date = new Date(msg.date * 1000);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const returnMessage = `
Time: ${hour}:${minute}
ID: ${msg.from.id}
  `;

  bot.sendMessage(chatId, returnMessage);
  console.log(msg)
});