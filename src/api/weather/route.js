import express from 'express';

const router = express.Router();

import weather from './service.js';

import { verifyLoginToken } from '#middleware/verifyLoginToken.js';

router.get('/', verifyLoginToken, weather);

export default router;
