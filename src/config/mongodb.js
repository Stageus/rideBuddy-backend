import 'dotenv/config';
import { MongoClient } from 'mongodb';
const url = `mongodb://localhost:27017`;
export const client = new MongoClient(url);
export const logs = client.db(process.env.MONGO_DB_NAME).collection(process.env.MONGO_DB_COLLECTION);

await client.connect();
