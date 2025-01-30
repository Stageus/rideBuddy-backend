import 'dotenv/config';
import { MongoClient } from 'mongodb';
import wrap from '#utility/wrapper.js';
const url = `mongodb://localhost:27017`;
const client = new MongoClient(url);
const db = client.db(process.env.MONGO_DB_NAME);
const logs = db.collection(process.env.MONGO_DB_COLLECTION);

const connectDb = wrap(async function () {
  await client.connect();
});

connectDb();

export function insertLog(req, res, next) {
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
