import pool from '#config/postgresql.js';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
const url = `mongodb://localhost:27017`;
const client = new MongoClient(url);
const logs = client.db(process.env.MONGO_DB_NAME).collection(process.env.MONGO_DB_COLLECTION);

const mongoConnect = async function () {
  try {
    await client.connect();
  } catch (err) {
    console.log('err');
  }
};

mongoConnect();

export function logging(req, res, next) {
  const oldSend = res.send;

  let reqTime = Date.now();
  let logData = {
    reqDate: new Date().toString(),
    remoteAddr: req.connection.remoteAddress,
    reqHeader: req.headers['user-agent'],
    reqMethod: req.method,
    url: req.originalUrl
  };

  res.send = async function (data) {
    let resTime = Date.now();
    const reqResTime = resTime - reqTime;
    logData.resStatus = res.statusCode;
    logData.reqResTime = reqResTime;
    await logs.insertOne({
      logData
    });
    oldSend.call(this, data);
  };

  next();
}
