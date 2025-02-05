import 'dotenv/config';
import cron from 'node-cron';
import { getWeatherData, deleteWeatherData, getAirData } from './src/module.js';
// src안에 module폴더 만들고 repo는 그냥 두구
// 여기는 프로그램 시작파일.
// 배포 해오기 백엔드 배포를 해와라라라라랄

const getWeatherDay = [2, 5, 8, 11, 14, 17, 20, 23];
getWeatherDay.forEach((hour) => {
  cron.schedule(`58 ${hour} * * *`, async () => {
    try {
      const currentTime = new Date();
      var year = currentTime.getFullYear();
      var month = (currentTime.getMonth() + 1).toString().padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더해야 함
      var day = currentTime.getDate().toString().padStart(2, '0');
      var date = `${year}${month}${day}`;
      console.log('date', date);
      await getWeatherData(date, hour);
    } catch (err) {
      console.error('cron내부오류');
    }
  });
});

// 하나씩 함수를 만들어라.
for (let i = 1; i < 24; i++) {
  cron.schedule(`5 ${i} * * *`, async () => {
    console.log('딜리트 함수 실행중');

    deleteWeatherData(i - 1);
  });
}
cron.schedule(`5 0 * * *`, async () => {
  deleteWeatherData(23);
});

// 2시간에 한번씩 getAirData 호출
cron.schedule('0 20 */2 * * *', async () => {
  try {
    const currentTime = new Date().toString();
    console.log(`주기적으로 미세먼지 함수 실행중, 현재시각 ${currentTime}`);
    await getAirData();
    const endTime = new Date().toString();
    console.log(`미세먼지 데이터로드 끝난시각${endTime}`);
  } catch (err) {
    console.error('cron.schedule에러발생');
  }
});
