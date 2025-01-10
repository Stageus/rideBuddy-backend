import axios from 'axios';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import path from 'path';
import csv from 'csv-parser';
import timeCheck from './timeCheck.js';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __filename = fileURLToPath(import.meta.url);
const filePath = path.join(__dirname, 'region_list.csv');

const getWeatherData = async (date, time) => {
  //252번 통신해야함
  //정해진 시간에 통신해야함 (02,05,08,11,14,17,20,23) 8번 통신해야함.
  //타겟 타임 설정후 그 시간이 되면 프로그램 시작.
  //req로 시작과, 설정 시간 전송해줌
  // 252번 돌린다. 파일 list 파일 참고해서 돌리면 된다.

  console.log(date, time);
  var rows = [];
  var results = [];

  const data = await fs.readFile(filePath, 'utf8');
  rows = data.split('\n');
  results = rows.map((row) => row.split(','));
  let cleanData = results.map((row) => row.map((item) => item.replace(/\r/g, '')));

  console.log(cleanData);
  for (let i = 0; i < 252; i++) {
    var ny = cleanData[i][2];
    var nx = cleanData[i][3];
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?
              serviceKey=${process.env.DATA_API_KEY}&numOfRows=100&pageNo=1&base_date=${date}&base_time=${time}&nx=${nx}&ny=${ny}`;
    const response = await axios({
      url: url,
      method: 'get' // 통신 방식
    });
    var weatherData = response;
    console.log(response);
    // await pool.query();
  }
  setInterval(timeCheck, 3 * 60 * 60 * 1000);
};

export default getWeatherData;
