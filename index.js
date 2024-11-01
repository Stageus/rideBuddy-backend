import express from 'express';
import 'dotenv/config';
import userRoute from './src/api/users/users.route';

//import cors from 'cors';
/*global process */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoute);

app.listen(process.env.PORT, () => {
  console.log('5000포트에서 웹서버 실행중');
});
