import axios from 'axios';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import path from 'path';
import csv from 'csv-parser';
import pool from './config/postgresql.js';
import { insertWeatherData, selectAirStation, insertAirData, deleteAirData } from './repository.js';
import wrap from './utility/wrapper.js';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __filename = fileURLToPath(import.meta.url);
const __dirname1 = path.dirname(__filename);
const filePath = path.join(__dirname1, '../region_list.csv');
export const getWeatherData = async (date, time) => {
  //252번 통신해야함
  //정해진 시간에 통신해야함 (02,05,08,11,14,17,20,23) 8번 통신해야함.
  //타겟 타임 설정후 그 시간이 되면 프로그램 시작.
  // req로 시작과, 설정 시간 전송해줌
  // 252번 돌린다. 파일 list 파일 참고해서 돌리면 된다.
  time = time + '00';
  console.log('날짜와 시간', date, time);
  var rows = [];
  var results = [];
  const data = await fs.readFile(filePath, 'utf8');
  console.log('data', data);
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

export const getAirData = wrap(async (req, res) => {
  // db에 저장된 서울 측정소 리스트

  const stationResults = await pool.query(selectAirStation);
  let stationList = stationResults.rows;
  // 데이터 저장전 db내용 삭제
  await pool.query(deleteAirData);

  const encodingServiceKey = process.env.AIR_SERVICE_KEY;
  const decodingServiceKey = decodeURIComponent(`${encodingServiceKey}`);
  // 40번 통신
  for (let station of stationList) {
    const airDataUrl = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty`;
    const airDataParams = {
      serviceKey: decodingServiceKey,
      returnType: 'json',
      stationName: station.station_name,
      dataTerm: 'DAILY',
      ver: 1.3
    };
    const airDataQuery = new URLSearchParams(airDataParams).toString();
    const airDataFetch = await fetch(`${airDataUrl}?${airDataQuery}`);
    const airDataResult = await airDataFetch.json();
    const airData = airDataResult.response.body.items[0];

    const pm10value = airData.pm10Value;
    const pm25value = airData.pm25Value;
    const pm10grade1h = airData.pm10Grade1h;
    const pm25grade1h = airData.pm25Grade1h;
    const surveyDateTime = airData.dataTime;

    await pool.query(insertAirData, [
      station.station_idx,
      pm10value,
      pm25value,
      pm10grade1h,
      pm25grade1h,
      surveyDateTime
    ]);
  }
  return;
});
