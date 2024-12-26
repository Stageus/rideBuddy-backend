import express from 'express';
const app = express();
// 가장 기본이 되는 express 시작

import 'dotenv/config';
// env 파일 활성화 config까지 해줌으로써 process.env 로 접근 가능하게 함.

app.use(express.json());
// josn 형식 -> js객체 형식으로 바꾼다.

import userRoute from './src/api/users/route.js';
app.use('/users', userRoute);

// import infoRoute from './src/api/info/route.js';
// app.use('/info', infoRoute);
// import mypagesRoute from './src/api/mypages/route.js';
// app.use('/mypages', mypagesRoute);
// import weatherRoute from './src/api/weather/route.js';
// app.use('/weather', weatherRoute);

app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT}포트에서 웹서버 실행중`);
});
