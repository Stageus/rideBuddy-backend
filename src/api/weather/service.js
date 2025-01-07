import axios from 'axios';
const weather = async (req, res) => {
  const nx = req.body.nx;
  const ny = req.body.ny;

  const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?
                request=coordsToaddr&coords=${nx},${ny}`;
  const response = await axios({
    url: url,
    method: 'get', // 통신 방식
    headers: {
      'x-ncp-apigw-api-key-id': MAP_API_ID,
      'x-ncp-apigw-api-key': MAP_API_KEY,
    },
  });
};

export default weather;
