import express from 'express';
import path from 'path';
import 'dotenv/config';
import { logging } from '#middleware/logger.js';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(logging);
app.use(
  cors({
    credentials: true,
    methods: ['GET', 'POST'],
    origin: '*'
  })
);

// const __dirname = path.resolve();
// app.get('/', (req, res) => {
//   res.sendFile(`${__dirname}/static/index.html`);
// });

//==============================================================================================================================================================================================
import userRoute from './src/api/users/route.js';
app.use('/users', userRoute);
import infoRoute from './src/api/info/route.js';
app.use('/info', infoRoute);
import mypagesRoute from './src/api/mypages/route.js';
app.use('/mypages', mypagesRoute);
import weatherRoute from './src/api/weather/route.js';
app.use('/weather', weatherRoute);
//==============================================================================================================================================================================================

app.use((err, req, res, next) => {
  console.log('에러핸들러 실행중', err);
  res.status(err.statusCode || 500).json({ message: err.message });
});

const currentTime = new Date().toString();
app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT}포트에서 ${currentTime}현재 웹서버 실행중`);
});
