import express from 'express';
import { weatherTimeCheck, airTimeCheck } from './src/service.js';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use('/', weatherTimeCheck, airTimeCheck);

app.use((err, req, res, next) => {
  console.log('에러', err);
  res.status(err.statusCode || 500).json({ message: err.message });
});

app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT}포트에서 웹서버 실행중`);
});

// pm2
