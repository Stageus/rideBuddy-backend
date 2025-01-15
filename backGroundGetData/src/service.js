import axios from 'axios';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import path from 'path';
import csv from 'csv-parser';
import timeCheck from '../utility/timeCheck.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../utility/region_list.csv');

const getWeatherData = async (date, time) => {
  //252번 통신해야함
  //정해진 시간에 통신해야함 (02,05,08,11,14,17,20,23) 8번 통신해야함.
  //타겟 타임 설정후 그 시간이 되면 프로그램 시작.
  //req로 시작과, 설정 시간 전송해줌
  // 252번 돌린다. 파일 list 파일 참고해서 돌리면 된다.

  // console.log(date, time);
  var rows = [];
  var results = [];

  const data = await fs.readFile(filePath, 'utf8');
  rows = data.split('\n');
  results = rows.map((row) => row.split(','));
  let cleanData = results.map((row) => row.map((item) => item.replace(/\r/g, '')));

  // console.log(cleanData);
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
    // console.log(response);
    // await pool.query();
  }
  setInterval(timeCheck, 3 * 60 * 60 * 1000);
};

const getAirData = async (req, res) => {
  //1. 정각마다 데이터 불러와서 저장하기.
  //2. 근데 만약에 16800번 통신해야할때 좀더 효율적으로 통신할 수 있는 방법이 있을까?
  //3.
  // pm2가 필요한 내 나름대로의 결론?
  // 1. 데이터를 대량으로 통신해서 가져오고 db내용에 있는거 삭제하고 하는데 사용자 요청가지 받으면 너무 느려지지 않을까?
  // 2. 느려진다면 왜 느려질까?
  // 3. pm2 클러스터? 사용하면 데이터 통신시 훨씬 효과적으로 할수 있을것같다.
  // 4.
};

export default getWeatherData;
