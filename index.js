const TelegramBot = require('node-telegram-bot-api');
const sql = require('mssql');

const token = '5018400836:AAHw90GzgFBkAdVXiYSgTPyBdMDfCg1BGDk';

const bot = new TelegramBot(token, {polling: true});

const sqlConfig = {
  user: 'sa',
  password: 'Aa123456',
  database: 'testanviz',
  server: 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}

sql.connect(sqlConfig).then(pool => {
  // Query
  
  return pool.request()
      .query('select * from Records')
}).then(result => {
  console.dir(result)
}).catch(err => {
  console.error(err.message)
});

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

let firstRunClear = true;  //clear all data from Late first run

function getData(){

  if (firstRunClear) {
    firstRunClear = false;
    sql.connect(sqlConfig).then(pool1 => {pool1.request().query(`delete from Records`)});
    return
  }

  sql.connect(sqlConfig).then(pool => {
    // Query

    return pool.request()
        .query('select * from Records')
  }).then(result => {
    
    for (let i = 0; i < result.recordset.length; i++){

      sql.connect(sqlConfig).then(pool1 => {pool1.request().query(`delete from Records where ID = ${result.recordset[i].ID}`)});
      let txt = `
==========================
${result.recordset[i].CODE == 0 ? 'IN' : 'OUT'}
${result.recordset[i].FIO}
==========================
`;

  bot.sendMessage(result.recordset[i].IDTELEGRAM1 , txt );

}
}).catch(err => {
// ... error checks
});
}


let intervalId = setInterval(getData, 5000)