import axios from 'axios';

import { getWeather, getData } from './repository.js';
import pool from '#config/postgresql.js';
import 'dotenv/config';
import wrap from '#utility/wrapper.js';

const weather = wrap(async (req, res) => {
  const nx = req.body.nx; // 37~
  const ny = req.body.ny; // 126~
  console.log('weather 실행중');
  console.log('nx : ', nx);
  console.log('ny : ', ny);

  const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?
                  request=coordsToaddr&coords=${ny},${nx}&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=JSON`;

  const response = await axios({
    url: url,
    method: 'GET',
    headers: {
      'x-ncp-apigw-api-key-id': process.env.MAP_API_KEY_ID,
      'x-ncp-apigw-api-key': process.env.MAP_API_KEY
    }
  });

  // 미세먼지용 법정동
  const legalSido = response.data.results[1].region.area1.name;
  const legalDong = response.data.results[1].region.area3.name;

  // results[0]은 행정동이고 results[1]은 법정동이라서 내거는 법정동으로 했어
  // 태준이 너도 고민해보고 맞는걸로 해

  const results = response.data.results;

  const area1 = results[0].region.area1.name;
  const area2 = results[0].region.area2.name;

  const weatherResult = await pool.query(getWeather, [area1, area2.replace(/ /g, '')]);
  console.log(area1, area2);
  const getResult = await pool.query(getData, [weatherResult.rows[0]['region_idx']]);

  console.log(getResult.rows[0]['time']);
  console.log(getResult.rows[0]['weather']);
  console.log(getResult.rows[0]['temperature']);
  console.log(getResult.rows[0]['rain']);

  const data = {
    weather: getResult.rows[0]['weather'],
    temperature: getResult.rows[0]['temperature'],
    nowrain: getResult.rows[0]['rain']
  };

  // 미세먼지 부분
  const encodingServiceKey = process.env.PUBLIC_SERVICE_KEY;
  const decodingServiceKey = decodeURIComponent(`${encodingServiceKey}`);

  //1. fetch로 사용자 위치(법정동)에 대한 TM 기준좌표 조회
  const TMurl = 'http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getTMStdrCrdnt';
  const TMParams = {
    serviceKey: decodingServiceKey,
    umdName: legalDong,
    returnType: 'json'
  };
  const TMQuery = new URLSearchParams(TMParams).toString();
  let tmX, tmY;
  const TMFetch = await fetch(`${TMurl}?${TMQuery}`);
  const TMResult = await TMFetch.json();
  // 동이름이 같은 지역이 있는경우 배열로 나오기때문에 '시도'이름으로 필터링하여 TM좌표 추출
  for (let array of TMResult.response.body.items) {
    if (array.sidoName == legalSido) {
      tmX = array.tmX;
      tmY = array.tmY;
    }
  }

  //2. TM좌표 기준 가장 근접한 측정소 조회
  const nearStaionUrl = `http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList`;
  const nearStationParams = {
    serviceKey: decodingServiceKey,
    returnType: 'json',
    tmX: tmX,
    tmY: tmY
  };
  const nearStationQuery = new URLSearchParams(nearStationParams).toString();
  const nearStationFetch = await fetch(`${nearStaionUrl}?${nearStationQuery}`);
  const nearStationResult = await nearStationFetch.json();
  const stationName = nearStationResult.response.body.items[0].stationName;

  //3. 측정소에 해당하는 값 불러오기

  // 여기서부터는 Pm2 필요

  //
  res.status(200).send({});
});

export default weather;
