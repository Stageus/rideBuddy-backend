import axios from 'axios';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import path from 'path';
import csv from 'csv-parser';
import pool from '#config/postgresql.js';
import { insertWeatherData } from './repository.js';
import { weatherTimeCheck } from '../utility/timeCheck.js';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __filename = fileURLToPath(import.meta.url);
const __dirname1 = path.dirname(__filename);
const filePath = path.join(__dirname1, '../region_list.csv');
const getWeatherData = async (date, time) => {
  //252번 통신해야함
  //정해진 시간에 통신해야함 (02,05,08,11,14,17,20,23) 8번 통신해야함.
  //타겟 타임 설정후 그 시간이 되면 프로그램 시작.
  //req로 시작과, 설정 시간 전송해줌
  // 252번 돌린다. 파일 list 파일 참고해서 돌리면 된다.

  time = time + '00';

  console.log('날짜와 시간', date, time);

  var rows = [];
  var results = [];

  const data = await fs.readFile(filePath, 'utf8');
  rows = data.split('\n');
  results = rows.map((row) => row.split(','));
  let cleanData = results.map((row) => row.map((item) => item.replace(/\r/g, '')));

  var ny;
  var nx;
  var url;
  var response;

  // console.log(cleanData);
  for (let i = 1; i <= 1; i++) {
    nx = cleanData[i][2];
    ny = cleanData[i][3];

    url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.DATA_API_KEY}&numOfRows=100&pageNo=1&base_date=${date}&base_time=${time}&nx=${nx}&ny=${ny}&dataType=JSON`;
    response = await axios.get(url);
    var weatherData = response.data.response.body.items;
    weatherData = Object.values(weatherData);
    const flattenedWeatherData = weatherData.flat();
    const filteredTMP = flattenedWeatherData.filter((item) => item.category === 'TMP');
    const filteredPCP = flattenedWeatherData.filter((item) => item.category === 'PCP');
    const filteredPTY = flattenedWeatherData.filter((item) => item.category === 'PTY');

    console.log(filteredPTY);
    console.log(filteredPCP);

    for (let j = 0; j < 7; j++) {
      if (filteredPCP[j]['fcstValue'] === '강수없음') {
        await pool.query(insertWeatherData, [
          i,
          filteredTMP[j]['fcstTime'],
          0,
          filteredTMP[j]['fcstValue'],
          filteredPTY[j]['fcstValue']
        ]);
      } else if (filteredPCP[j]['fcstValue'] === '50.0mm 이상') {
        await pool.query(insertWeatherData, [
          i,
          filteredTMP[j]['fcstTime'],
          '50',
          filteredTMP[j]['fcstValue'],
          filteredPTY[j]['fcstValue']
        ]);
      }
    }
  }
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
