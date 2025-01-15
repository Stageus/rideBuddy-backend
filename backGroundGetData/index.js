import express from 'express';
const app = express();

app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT}포트에서 웹서버 실행중`);
});

// pm2
