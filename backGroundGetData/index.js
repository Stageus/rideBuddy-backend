import express from 'express'; // 지우기
import 'dotenv/config';
import cron from 'node-cron';
import wrap from './src/utility/wrapper.js';
import { getWeatherData, deleteWeatherData, getAirData } from './src/module.js';
const app = express(); //지우기
// 반복문을 이렇게 쓰는건 잘못되었음.
// foreach해서 list만들어서 돌리기.
// 의도파악을 해야하는 코드는 좋은 코드가 아님.
// src안에 module폴더 만들고 repo는 그냥 두구
// 여기는 프로그램 시작파일.
// 배포 해오기 백엔드 배포를 해와라라라라랄
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
// 하나씩 함수를 만들어라.
for (let i = 0; i < 24; i++) {
  cron.schedule(
    `5 ${i} * * *`,
    wrap(async () => {
      deleteWeatherData(i);
    })
  );
}

// 2시간에 한번씩 getAirData 호출
cron.schedule(
  '0 20 */2 * * *',
  wrap(async () => {
    const currentTime = new Date().toString();
    console.log(`주기적으로 함수 실행중, 현재시각 ${currentTime}`);
    await getAirData();
  })
);
