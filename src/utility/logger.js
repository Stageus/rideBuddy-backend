import winston from 'winston';
import 'winston-daily-rotate-file';

import 'dotenv/config';
import { toNamespacedPath } from 'path';
const { combine, timestamp, json, align, printf, errors } = winston.format;

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
