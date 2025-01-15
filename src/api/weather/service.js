import axios from 'axios';
import { getWeather, getData } from './repository.js';
import pool from '#config/postgresql.js';

const weather = async (req, res) => {
  const nx = req.body.nx;
  const ny = req.body.ny;
  console.log('weather 실행중');
  console.log('nx : ', nx);
  console.log('ny : ', ny);

  const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${nx},${ny}&output=JSON`;
  const response = await axios({
    url: url,
    method: 'get', // 통신 방식
    headers: {
      'x-ncp-apigw-api-key-id': process.env.MAP_API_ID,
      'x-ncp-apigw-api-key': process.env.MAP_API_KEY
    }
  });
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
  res.status(200).send({ data: data });
};

export default weather;
