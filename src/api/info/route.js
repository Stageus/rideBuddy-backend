import express from 'express';
import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { position, search, giveInformationRoad, giveInformationCenter, getCenterList } from './tj/service.js';
const router = express.Router();

router.get('/roads', verifyLoginToken);
router.get('/centers', verifyLoginToken, getCenterList);
router.get('/', verifyLoginToken);
router.put('/roads/:road-idx/like', verifyLoginToken);
router.put('/centers/:center-idx/like', verifyLoginToken);
router.get('/roads/:roadIdx', giveInformationRoad);
router.get('/centers/:centerIdx', giveInformationCenter);
router.get('/search', search);
router.get('/position', position);

export default router;
