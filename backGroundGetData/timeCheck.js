import moment from 'moment';
import getWeatherData from './pm2.js';

const timeCheck = (req, res) => {
  const currentTime = new Date();
  var year = currentTime.getFullYear();
  var month = (currentTime.getMonth() + 1).toString().padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더해야 함
  var day = currentTime.getDate().toString().padStart(2, '0');
  var date;
  var chooseHours;

  const currentHours = currentTime.getHours();
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

  getWeatherData(date, chooseHours);
};

export default timeCheck;
