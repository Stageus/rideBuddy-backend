import { client as pgClient } from '#config/postgresql.js';
import { client as mongoClient } from '#config/mongodb.js';

export function releaseDb() {
  pgClient.release();
  mongoClient.close();
}
