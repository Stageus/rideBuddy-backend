import moment from 'moment';
import { getWeatherData, getAirData } from '../service.js';

export const weatherTimeCheck = (req, res) => {
  const currentTime = new Date();
  var year = currentTime.getFullYear();
  var month = (currentTime.getMonth() + 1).toString().padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더해야 함
  var day = currentTime.getDate().toString().padStart(2, '0');
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  console.log('currentHours : ', currentHours, 'currentMinutes : ', currentMinutes);
  var nowTime = currentHours * 60 + currentMinutes;

  var date;
  var chooseHours;
  var timeGap;
  var gapTime;

  console.log('currentTime', currentTime);
  console.log('currentHours', currentHours);

  if (currentHours < 3) {
    chooseHours = 23;
    date = moment().add(-1, 'days').format('YYYYMMDD');
  } else if (currentHours < 6) {
    chooseHours = 2;
    date = `${year}${month}${day}`;
  } else if (currentHours < 9) {
    chooseHours = 5;
    date = `${year}${month}${day}`;
  } else if (currentHours < 12) {
    chooseHours = 8;
    date = `${year}${month}${day}`;
  } else if (currentHours < 15) {
    chooseHours = 11;
    date = `${year}${month}${day}`;
  } else if (currentHours < 18) {
    chooseHours = 14;
    date = `${year}${month}${day}`;
  } else if (currentHours < 21) {
    chooseHours = 17;
    date = `${year}${month}${day}`;
  } else {
    chooseHours = 20;
    date = `${year}${month}${day}`;
  }
  console.log('현재 날짜: ', date, '불러올 시간: ', chooseHours);
  if (nowTime < 2 * 60) {
    timeGap = 2 * 60 - nowTime;
    gapTime = 2;
  } else if (nowTime < 5 * 60) {
    timeGap = 5 * 60 - nowTime;
    gapTime = 5;
  } else if (nowTime < 8 * 60) {
    timeGap = 8 * 60 - nowTime;
    gapTime = 8;
  } else if (nowTime < 11 * 60) {
    timeGap = 11 * 60 - nowTime;
    gapTime = 11;
  } else if (nowTime < 14 * 60) {
    timeGap = 14 * 60 - nowTime;
    gapTime = 14;
  } else if (nowTime < 17 * 60) {
    timeGap = 17 * 60 - nowTime;
    gapTime = 17;
  } else if (nowTime < 20 * 60) {
    timeGap = 20 * 60 - nowTime;
    gapTime = 20;
  } else if (nowTime < 23 * 60) {
    timeGap = 23 * 60 - nowTime;
    gapTime = 23;
  }
  getWeatherData(date, chooseHours);
  gapTime = gapTime + 3;
  console.log('몇분후에 함수 gap 함수 실행 : ', timeGap, '실행할 함수 시간:', gapTime);
  setTimeout(
    () => {
      getWeatherData(date, gapTime);
      setInterval(timeCheck, 3 * 60 * 60 * 1000);
    },
    timeGap * 60 * 1000
  );

  // 11 14 17 20 23 2 5 8
};

export const airTimeCheck = (req, res) => {
  // 정각이 될때 getAirData 호출
  // 현재 시간과 다음정각까지 남은 시간을 계산하고 그 시간에 맞춰 작업을 예약한다.
  const currentTime = new Date(); //.toString();
  const currentMinutes = currentTime.getMinutes();
  // 다음 정각까지 남은 시간 계산.
  // 다음 정각?
  // 음 만약 12시 어쩌구면
  // 1시. 만약 12시 정각이면
  if (currentMinutes == 0) {
    // getAirData();
    // 하고 setInterval로 1시간마다 함수 실행
  } // 정각이 아니면
  else {
    // 정각까지 남은시간 계산
    const leftTime = 60 - currentMinutes;
    console.log('남은시간', leftTime);
    console.log('밀리초', 1000 * 60 * leftTime);
    //  setTimeout(getAirData(), 1000 * 60 * leftTime); 이렇게 하면 프로미스 객체가 전달되서 안된다고 함
    // 정각까지 남은시간 계산해서 setTimeout 해주고 그이후로 setInterval로 1시간마다 함수 실행
  }
  console.log('현재', currentTime, currentMinutes);
};
