import winston from 'winston';
import 'winston-mongodb';
import 'winston-daily-rotate-file';
import 'dotenv/config';

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

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  level: 'http',
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json(),
    align()
  ),
});

const mongoDBTransport = new winston.transports.MongoDB({});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'http',

  transports: [
    //transports.console,
    //new winston.transports.Console({ level: 'http' }),
    // new winston.transports.Console({
    //   level: 'error',
    //   format: combine(errorFilter(), timestamp(), json()),
    // }),
    fileRotateTransport,
  ],
});

export default logger;
