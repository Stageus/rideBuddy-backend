import logs from '#config/mongodb.js';

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
