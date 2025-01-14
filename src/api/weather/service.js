import axios from 'axios';
import { getWeather } from './repository.js';

import 'dotenv/config';
import proj4 from 'proj4';

const weather = async (req, res) => {
  const nx = req.body.nx; // 위도 37 어쩌구
  const ny = req.body.ny; // 경도 126 어쩌구

  // 날씨 부분
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

  // const results = response.data.results;
  // console.log(results[0].region.area1.name);
  // console.log(results[0].region.area2.name);

  console.log('response', response.data.results[1].region);

  // const area1 = results[0].region.area1.name;
  // const area2 = results[0].region.area2.name;

  // weatherResult = await pool.query(getWeather, [area1, area2.replace(/ /g, '')]);
  // const data = {
  //   data: {
  //     weather: weatherResult.now_weather,
  //     temperature: weatherResult.now_temperature,
  //     nowrain: weatherResult.now_temperature,
  //     _1h_after_rain: weatherResult._1h_after_rain,
  //     _2h_after_rain: weatherResult._2h_after_rain,
  //     _3h_after_rain: weatherResult._3h_after_rain,
  //     _4h_after_rain: weatherResult._4h_after_rain,
  //     _1h_after_weather: weatherResult._1h_after_weather,
  //     _2h_after_weather: weatherResult._2h_after_weather,
  //     _3h_after_weather: weatherResult._3h_after_weather,
  //     _4h_after_weather: weatherResult._4h_after_weather,
  //     _1h_after_temperature: weatherResult._1h_after_temperature,
  //     _2h_after_temperature: weatherResult._2h_after_temperature,
  //     _3h_after_temperature: weatherResult._3h_after_temperature,
  //     _4h_after_temperature: weatherResult._4h_after_temperature
  //   }
  // };

  // 미세먼지 부분
  // 1. nx ny를 grs80으로 변경
  //
  proj4.defs(
    'EPSG:5186',
    '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs'
  );
  const result = proj4('EPSG:5186', [ny, nx]);

  console.log('결과', result);
  res.status(200).send({});
};

export default weather;
