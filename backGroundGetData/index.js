import express from 'express';
import 'dotenv/config';
import cron from 'node-cron';
import wrap from './src/utility/wrapper.js';
import { getWeatherData, deleteWeatherData, airTimeCheck } from './src/service.js';
const app = express();

for (let i = 2; i < 24; i += 3) {
  cron.schedule(
    `2 ${i} * * *`,
    wrap(async () => {
      const currentTime = new Date();
      var year = currentTime.getFullYear();
      var month = (currentTime.getMonth() + 1).toString().padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더해야 함
      var day = currentTime.getDate().toString().padStart(2, '0');
      date = `${year}${month}${day}`;
      getWeatherData(date, i);
    })
  );
}

for (let i = 0; i < 24; i++) {
  cron.schedule(
    `5 ${i} * * *`,
    wrap(async () => {
      deleteWeatherData(i);
    })
  );
}

airTimeCheck();
