import axios from 'axios';

import { getWeather, getData, selectAirData } from './repository.js';
import pool from '#config/postgresql.js';
import 'dotenv/config';
import wrap from '#utility/wrapper.js';

const weather = wrap(async (req, res) => {
  const nx = req.body.nx; // 37~
  const ny = req.body.ny; // 126~
  console.log('weather 실행중');
  console.log('nx : ', nx);
  console.log('ny : ', ny);

  var data = {};
  const currentTime = new Date();
  var hours = currentTime.getHours();

  console.log('시간 : ', hours);

  const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${nx},${ny}&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=JSON`;

  const response = await axios({
    url: url,
    method: 'GET',
    headers: {
      'x-ncp-apigw-api-key-id': process.env.MAP_API_KEY_ID,
      'x-ncp-apigw-api-key': process.env.MAP_API_KEY
    }
  });

  // ============================여기까지가 시간 설정 + reversegeocode ==========================================================

  // reversegeocode 로부터 한글 위치 추출
  const legalSido = response.data.results[1].region.area1.name;
  const legalDong = response.data.results[1].region.area3.name;
  const legalSigungu = response.data.results[1].region.area2.name;

  //해당 하는 idx 값 추출 (웨더)

  const weatherResult = await pool.query(getWeather, [legalSido, legalSigungu.replace(/ /g, '')]);
  const region_idx = weatherResult.rows[0]['region_idx'];

  // ===================================미세먼지 부분==========================================================
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

  // 3. 측정소에 해당하는 값 불러오기
  const airData = await pool.query(selectAirData, [stationName]);
  data = {
    stationName: airData.rows[0].station_name,
    pm10Value: airData.rows[0].pm10value,
    pm25Value: airData.rows[0].pm25value,
    pm10Grade1h: airData.rows[0].pm10grade1h,
    pm25Grade1h: airData.rows[0].pm25grade1h,
    dateTime: airData.rows[0].survey_date_time.toString()
  };
  // ===================================웨더 부분==========================================================

  for (let i = 0; i <= 3; i++) {
    if (hours + i >= 24) {
      formHours = hours + i - 24 + '00';
    } else {
      var formHours = hours + i + '00';
    }

    const getResult = await pool.query(getData, [region_idx, formHours]);

    console.log(getResult.rows[0]);

    data[`${i}_rain`] = getResult.rows[0]['rain'];
    data[`${i}_weather`] = getResult.rows[0]['weather'];
    data[`${i}_temperature`] = getResult.rows[0]['temperature'];
  }

  res.status(200).send(data);
});

export default weather;
