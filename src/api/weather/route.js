import express from 'express';

const router = express.Router();

import weather from './service.js';

import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { validateRegx } from '#middleware/validateRegx.js';
import { longitudeRegx, latitudeRegx } from '#utility/regx.js';
// prettier-ignore
router.get('/', verifyLoginToken, validateRegx([['longitude', longitudeRegx],['latitude', latitudeRegx]]), weather);

export default router;
