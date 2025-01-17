import 'dotenv/config';
import morgan from 'morgan';

morgan;
// morgan을 쓰는 이유가 있나
// winston을 쓰는 이유가 있나
// mongodb를 쓰는 이유가 있나

// morgan에서 바로 mongodb넣을수있는거 아냐?
// 깡으로 안하고 morgan으로 하는 이유는?
// 다 설명할 수 있어야해..

// morgan-mongo 를 사용하면 winston 안써도 되긴 해.
// 그럼 morgan-mongo를 쓸까? winston 이랑 winston-=mongodb를 쓰는... 것 보다 낫다..?왜?
// 1. 일단 내가 morgan 을 mongoose로 직접 넣을 수는 없는건지?
// 하 ~~ 넣을수 있을것 같은데.. 모르겟넹...
// 2. 만약에 직접 넣을수 없다면 왜 넣을 수 업느건지?
// 3. 넣을 수 있다면 어떻게 넣을 수 있는건지? -> 정리하고 끝.
// 4. 넣을 수 없다고 결정했다면 morgan-mongo를 쓸건지 winston이랑 winston-mongodb를 쓸건지?
// 5. 다 차치하고 깡으로 하는게 morgan을 쓸때보다 뭐가더 안 좋은지?

// mongodb연결을 위한 셋팅
import { MongoClient } from 'mongodb';
const url = `mongodb://localhost:27017`;
const client = new MongoClient(url);
async function connectDb() {
  await client.connect();
}
connectDb();

// mongodb는 ttl도 활 수 있음.

// Mongodb에는 level 설정할수있으니까 error레벨 로
// file
// const transportOptions = {};

// const mongoDBTransport = new winston.transports.MongoDB(transportOptions);

// const logger = winston.createLogger({
//   level: process.env.LOG_LEVEL || 'http',
//   transports: [
//     //transports.console,
//     //new winston.transports.Console({ level: 'http' }),
//     // new winston.transports.Console({
//     //   level: 'error',
//     //   format: combine(errorFilter(), timestamp(), json()),
//     // }),
//     // mongoDBTransport,
//   ]
// });

// export default logger;
