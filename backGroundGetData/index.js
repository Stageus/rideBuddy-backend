import express from 'express';
import { weatherTimeCheck, airTimeCheck } from './src/utility/timeCheck.js';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use('/', airTimeCheck);
app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT}포트에서 웹서버 실행중`);
});

// pm2
