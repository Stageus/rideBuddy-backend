import express from 'express';
import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { validateRegx } from '#middleware/validateRegx.js';
import {
  position,
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
import { longitudeRegx, latitudeRegx, numRegx } from '#utility/regx.js';

const router = express.Router();
// prettier-ignore
router.get('/roads',verifyLoginToken,validateRegx([['page', numRegx],['longitude', longitudeRegx],['latitude', latitudeRegx]]),getRoadsList);
// prettier-ignore
router.get('/centers',verifyLoginToken,validateRegx([['page', numRegx],['longitude', longitudeRegx],['latitude', latitudeRegx]]),getCentersList);
// prettier-ignore
router.get('/',verifyLoginToken,validateRegx([['page', numRegx],['longitude', longitudeRegx],['latitude', latitudeRegx]]),searchEnter);
router.put('/roads/:roadName/like', verifyLoginToken, roadLike);
router.put('/centers/:centerIdx/like', verifyLoginToken, centerLike);
router.get('/roads/:roadIdx', verifyLoginToken, giveInformationRoad);
router.get('/centers/:centerIdx', verifyLoginToken, giveInformationCenter);
router.get('/search', verifyLoginToken, search);
router.get('/position', verifyLoginToken, position);
// prettier-ignore
router.get('/pin',verifyLoginToken,validateRegx([['longitude', longitudeRegx],['latitude', latitudeRegx]]),getPin);
export default router;
