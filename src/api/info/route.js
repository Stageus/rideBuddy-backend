import express from 'express';
import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { position, search, giveInformationRoad, giveInformationCenter, getCenterList } from './tj/service.js';
const router = express.Router();

router.get('/roads', verifyLoginToken);
router.get('/centers', verifyLoginToken, getCenterList);
router.get('/', verifyLoginToken);
router.put('/roads/:road-idx/like', verifyLoginToken);
router.put('/centers/:center-idx/like', verifyLoginToken);
router.get('/roads/:roadIdx', verifyLoginToken, giveInformationRoad);
router.get('/centers/:centerIdx', verifyLoginToken, giveInformationCenter);
router.get('/search', verifyLoginToken, search);
router.get('/position', verifyLoginToken, position);

export default router;
