import 'dotenv/config';
import axios from 'axios';
import {
  formattedTime1,
  formattedDate1,
  formattedTime2,
  formattedDate2,
} from '../../config/timealgorythm.js';

export const weather = async (req, res, next) => {
  try {
    const { lat, lon } = req.body;

    if (!lat || !lon) {
      return res
        .status(404)
        .json({ error: 'nx, ny값에 대한 날씨정보를 찾을 수 없음' });
    }

    const response1 = await axios.get(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.API_KEY}&numOfRows=100&pageNo=1&base_date=${formattedDate1}&base_time=${formattedTime1}&nx=${lat}&ny=${lon}&dataType=JSON`
    );
    // 내부 API에서 받은 데이터를 처리

    const response2 = await axios.get(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.API_KEY}&numOfRows=100&pageNo=1&base_date=${formattedDate2}&base_time=${formattedTime2}&nx=${lat}&ny=${lon}&dataType=JSON`
    );

    res.json({
      response1: 'Response 1',
      response2: 'Response 2',
    });

    console.log(response1.data);
    console.log(response2.data);
    console.log(formattedDate1);
    console.log(formattedTime1);
    console.log(formattedDate2);
    console.log(formattedTime2);

    const weatherData1 = response1.data.response.body.items.item;
    const weatherData2 = response2.data.response.body.items.item;
  } catch (error) {
    res.status(500).json({ error: 'Internal API call failed' });
  }
};
