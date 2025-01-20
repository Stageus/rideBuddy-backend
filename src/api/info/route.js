import express from 'express';
import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { position, search, giveInformationRoad, giveInformationCenter } from './tj/service.js';
import { getCentersList, getRoadsList, searchEnter, roadLike, centerLike, getPin } from './yr/service.js';
const router = express.Router();

router.get('/roads', getRoadsList); //verifyLoginToken,
router.get('/centers', getCentersList);
router.get('/', searchEnter);
router.put('/roads/:roadName/like', verifyLoginToken, roadLike);
router.put('/centers/:centerIdx/like', verifyLoginToken, centerLike);
router.get('/roads/:roadIdx', verifyLoginToken, giveInformationRoad); //완료
router.get('/centers/:centerIdx', verifyLoginToken, giveInformationCenter); //완료
router.get('/search', verifyLoginToken, search); //완료
router.get('/position', verifyLoginToken, position); //완료
router.get('/pin', getPin);
export default router;
