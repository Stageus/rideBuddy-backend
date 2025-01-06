import winston from 'winston';
import 'winston-mongodb';
import 'dotenv/config';
import morgan from 'morgan';

morgan;
// morgan을 쓰는 이유가 있나
// winston을 쓰는 이유가 있나
// mongodb를 쓰는 이유가 있나

// morgan에서 바로 mongodb넣을수있는거 아냐?
// 깡으로 안하고 morgan으로 하는 이유는?
// 다 설명할 수 있어야해..

// mongodb연결을 위한 셋팅
import { MongoClient } from 'mongodb';
const url = `mongodb://localhost:27017`;
const client = new MongoClient(url);
async function connectDb() {
  await client.connect();
}
connectDb();

const { combine, timestamp, json, align, printf, errors } = winston.format;

// mongodb는 ttl도 활 수 있음.

// Mongodb에는 level 설정할수있으니까 error레벨 로
// file
// const transportOptions = {};

// const mongoDBTransport = new winston.transports.MongoDB(transportOptions);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'http',
  transports: [
    //transports.console,
    //new winston.transports.Console({ level: 'http' }),
    // new winston.transports.Console({
    //   level: 'error',
    //   format: combine(errorFilter(), timestamp(), json()),
    // }),
    // mongoDBTransport,
  ],
});

export default logger;
