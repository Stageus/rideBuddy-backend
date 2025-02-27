import axios from 'axios';
import wrap from '#utility/wrapper.js';
import { pool } from '#config/postgresql.js';
import { getWeather, getData, selectAirData } from './repository.js';
import { NotFoundError } from '#utility/customError.js';
const weather = wrap(async (req, res) => {
  const latitude = req.body.latitude; // 37~
  const longitude = req.body.longitude; // 126~

  var data = {};
  const currentTime = new Date();
  var hours = currentTime.getHours();
  const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${longitude},${latitude}&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=JSON`;

  const response = await axios({
    url: url,
    method: 'GET',
    headers: {
      'x-ncp-apigw-api-key-id': process.env.MAP_API_KEY_ID,
      'x-ncp-apigw-api-key': process.env.MAP_API_KEY
    }
  });

  // ============================여기까지가 시간 설정 + reversegeocode ==========================================================

  const geocodeStatus = response.data.status['code'];
  if (geocodeStatus != 0) {
    // 코드값이 0이 아니면 응답에 오류가 있거나 결과 없음.
    throw new NotFoundError('위치가 한국이 아닙니다.');
  }

  // ============================여기까지가 404 잡기  ==========================================================

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

  //1. 사용자 위치(법정동)에 대한 TM 기준좌표 조회
  const TMurl = 'http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getTMStdrCrdnt';
  const TMParams = {
    serviceKey: decodingServiceKey,
    umdName: legalDong,
    returnType: 'json'
  };

  let tmX, tmY;
  const TMaxios = await axios({
    method: 'get',
    url: TMurl,
    params: TMParams
  });

  // 동이름이 같은 지역이 있는경우 배열로 나오기때문에 '시도'이름으로 필터링하여 TM좌표 추출
  for (let array of TMaxios.data.response.body.items) {
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
  const nearStationAxios = await axios({
    method: 'get',
    url: nearStaionUrl,
    params: nearStationParams
  });

  const stationName = nearStationAxios.data.response.body.items[0].stationName;

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

  for (let i = 0; i <= 4; i++) {
    if (hours + i >= 24) {
      formHours = hours + i - 24 + '00';
    } else {
      var formHours = hours + i + '00';
    }

    const getResult = await pool.query(getData, [region_idx, formHours]);
    console.log('getResult', getResult);
    console.log('region', region_idx);
    console.log('form', formHours);
    console.log('결과', getResult.rows[0]);
    data[`${i}_rain`] = getResult.rows[0]['rain'];
    data[`${i}_weather`] = getResult.rows[0]['weather'];
    data[`${i}_temperature`] = getResult.rows[0]['temperature'];
  }

  res.status(200).send(data);
});

export default weather;
