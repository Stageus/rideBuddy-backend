import express from 'express';
import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { position, search, giveInformationRoad, giveInformationCenter } from './tj/service.js';
import { getCentersList, getRoadsList, searchEnter, roadLike, centerLike, getPin } from './yr/service.js';
const router = express.Router();

router.get('/roads', verifyLoginToken, getRoadsList);
router.get('/centers', verifyLoginToken, getCentersList);
router.get('/', verifyLoginToken, searchEnter);
router.put('/roads/:roadName/like', verifyLoginToken, roadLike);
router.put('/centers/:centerIdx/like', verifyLoginToken, centerLike);
router.get('/roads/:roadIdx', verifyLoginToken, giveInformationRoad);
router.get('/centers/:centerIdx', verifyLoginToken, giveInformationCenter);
router.get('/search', verifyLoginToken, search);
router.get('/position', verifyLoginToken, position);
router.get('/pin', verifyLoginToken, getPin);
export default router;
