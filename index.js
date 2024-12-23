import express from 'express';
import 'dotenv/config';
import userRoute from './src/api/users/users.route.js';
import path from 'path';
import cookieParser from 'cookie-parser';

// import infoRoute from './src/api/info/info.route';
import weatherRoute from './src/api/weather/weather.route.js';
// import mypagesRoute from './src/api/mypages/mypages.route';
//import cors from 'cors';
/*global process */

import passport from 'passport';
import './src/config/passport.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 왜 했는지 찾아보고 수정하기
app.use(cookieParser());
// string 으로 보내주면 프론트에게 위임.
// 쿠키는 프론트에서도 만들수 있다.
// 쿠키 생성자 라는게 있음.
// 쿠키를 주면 도메인이 달라서 문제가 되니까 프록시 서버를 써야함.
// 쿠키의 발행자가 백엔드니까 (stateless에 걸맞지 않으므로) 쿠키를 프론트가 삭제하지 못함....
// 도메인이 다르면 쿠키가 안날라가 -> cors에러
// 그래서 string 으로 프론트에게 보내줌.
// 쿠키를 만들어서 줬으면
// 토큰의 자료형은 string
// string으로 보내주자.

//로그인기능 테스트용
const __dirname = path.resolve();
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/src/test/index.html`);
});

app.use('/users', userRoute);
// app.use('/info', infoRoute);
app.use('/weather', weatherRoute);
// app.use('/mypages', mypagesRoute);

app.listen(process.env.PORT, () => {
  console.log('5000포트에서 웹서버 실행중');
});
