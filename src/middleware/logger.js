import { logs } from '#config/mongodb.js';

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
    let reqResTime = resTime - reqTime;

    logData.resStatus = res.statusCode;
    logData.reqResTime = reqResTime;
    try {
      await logs.insertOne({
        logDatas
      });
    } catch (err) {
      next(err);
    }
    oldSend.call(this, data);
  };

  next();
}
