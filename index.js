import express from 'express';
import path from 'path';
import 'dotenv/config';
const app = express();

app.use(express.json());
// josn 형식 -> js객체 형식으로 바꾼다.

//로그인기능 테스트용
const __dirname = path.resolve();
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/src/test/index.html`);
});
//==============================================================================================================================================================================================
import userRoute from './src/api/users/route.js';
app.use('/users', userRoute);
// import infoRoute from './src/api/info/route.js';
// app.use('/info', infoRoute);

import mypagesRoute from './src/api/mypages/route.js';
app.use('/mypages', mypagesRoute);
// import weatherRoute from './src/api/weather/route.js';
// app.use('/weather', weatherRoute);

//==============================================================================================================================================================================================
app.use((err, req, res, next) => {
  console.log('에러', err);
  res.send(err.message);
});

// app.use(Errorhandler);

app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT}포트에서 웹서버 실행중`);
});
