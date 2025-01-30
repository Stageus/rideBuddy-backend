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

export default logs;
