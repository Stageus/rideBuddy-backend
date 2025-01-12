import axios from 'axios';
import { getWeather } from './repository.js';
const weather = async (req, res) => {
  const nx = req.body.nx;
  const ny = req.body.ny;

  const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?
                request=coordsToaddr&coords=${nx},${ny}&output=JSON`;
  const response = await axios({
    url: url,
    method: 'get', // 통신 방식
    headers: {
      'x-ncp-apigw-api-key-id': process.env.MAP_API_ID,
      'x-ncp-apigw-api-key': process.env.MAP_API_KEY
    }
  });
  const results = response.data.results;
  // console.log(results[0].region.area1.name);
  // console.log(results[0].region.area2.name);

  const area1 = region.area1.name;
  const area2 = region.area2.name;

  weatherResult = await pool.query(getWeather, [area1, area2.replace(/ /g, '')]);
  const data = {
    data: {
      weather: weatherResult.now_weather,
      temperature: weatherResult.now_temperature,
      nowrain: weatherResult.now_temperature,
      _1h_after_rain: weatherResult._1h_after_rain,
      _2h_after_rain: weatherResult._2h_after_rain,
      _3h_after_rain: weatherResult._3h_after_rain,
      _4h_after_rain: weatherResult._4h_after_rain,
      _1h_after_weather: weatherResult._1h_after_weather,
      _2h_after_weather: weatherResult._2h_after_weather,
      _3h_after_weather: weatherResult._3h_after_weather,
      _4h_after_weather: weatherResult._4h_after_weather,
      _1h_after_temperature: weatherResult._1h_after_temperature,
      _2h_after_temperature: weatherResult._2h_after_temperature,
      _3h_after_temperature: weatherResult._3h_after_temperature,
      _4h_after_temperature: weatherResult._4h_after_temperature
    }
  };
  res.status(200).send({ data: data });
};

export default weather;
