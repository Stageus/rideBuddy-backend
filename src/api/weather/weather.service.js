import 'dotenv/config';
import axios from 'axios';

export const weather = async (req, res, next) => {
  try {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    const response1 = await axios.get(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.API_KEY}&numOfRows=100&pageNo=1&base_date=${formattedDate}&base_time=${formattedTime}&nx=55&ny=127&dataType=JSON`
    );
    // 내부 API에서 받은 데이터를 처리

    const response2 = await axios.get(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.API_KEY}&numOfRows=100&pageNo=1&base_date=${formattedDate}&base_time=${formattedTime}&nx=55&ny=127&dataType=JSON`
    );

    res.json({
      response1: 'Response 1',
      response2: 'Response 2',
    });

    console.log(response1.data);
    console.log(response2.data);
    console.log(formattedDate);
    console.log(formattedTime);
  } catch (error) {
    res.status(500).json({ error: 'Internal API call failed' });
  }
};
