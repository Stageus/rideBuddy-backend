import express from 'express';
import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { validateRegx } from '#middleware/validateRegx.js';
import {
  centerPosition,
  roadPosition,
  search,
  giveInformationRoad,
  giveInformationCenter,
  getCentersList,
  getRoadsList,
  searchEnter,
  roadLike,
  centerLike,
  getPin
} from './service.js';
import { longitudeRegx, latitudeRegx, numRegx, searchRegx } from '#utility/regx.js';
import { validate } from 'node-cron';

const router = express.Router();
// prettier-ignore
router.get('/roads',verifyLoginToken,validateRegx([['page', numRegx],['longitude', longitudeRegx],['latitude', latitudeRegx]]),getRoadsList);
// prettier-ignore
router.get('/centers',verifyLoginToken,validateRegx([['page', numRegx],['longitude', longitudeRegx],['latitude', latitudeRegx]]),getCentersList);
// prettier-ignore
router.get('/',verifyLoginToken,validateRegx([['search',searchRegx],['page', numRegx],['longitude', longitudeRegx],['latitude', latitudeRegx]]),searchEnter);
router.put('/roads/:roadName/like', verifyLoginToken, roadLike);
router.put('/centers/:centerIdx/like', verifyLoginToken, centerLike);
router.get('/roads/:roadIdx', verifyLoginToken, giveInformationRoad);
router.get('/centers/:centerIdx', verifyLoginToken, giveInformationCenter);
router.get('/search', verifyLoginToken, validateRegx([['search', searchRegx]]), search);
router.get('/center/position', verifyLoginToken, centerPosition);
router.get('/road/position', verifyLoginToken, roadPosition);
// prettier-ignore
router.get('/pin',verifyLoginToken,validateRegx([['longitude', longitudeRegx],['latitude', latitudeRegx]]),getPin);
export default router;
