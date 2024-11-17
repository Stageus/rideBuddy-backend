import express from 'express';
import 'dotenv/config';
import userRoute from './src/api/users/users.route.js';
import path from 'path';

// import infoRoute from './src/api/info/info.route';
// import weatherRoute from './src/api/weather/weather.route';
// import mypagesRoute from './src/api/mypages/mypages.route';
//import cors from 'cors';
/*global process */

import passport from 'passport';
import './src/config/passport.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

//로그인기능 테스트용
const __dirname = path.resolve();
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/src/test/index.html`);
});

app.use('/users', userRoute);
// app.use('/info', infoRoute);
// app.use('/weather', weatherRoute);
// app.use('/mypages', mypagesRoute);

app.listen(process.env.PORT, () => {
  console.log('5000포트에서 웹서버 실행중');
});
