import express from 'express';
import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
const router = express.Router();

router.get('/roads', verifyLoginToken);
router.get('/centers', verifyLoginToken);
router.get('/', verifyLoginToken);
router.put('/roads/:road-idx/like', verifyLoginToken);
router.put('/centers/:center-idx/like', verifyLoginToken);
router.get('/roads/:road-idx', verifyLoginToken);
router.get('/centers/:center-idx', verifyLoginToken);
router.get('/search', verifyLoginToken);
router.get('/position', verifyLoginToken, function () {
  console.log('hi');
});

export default router;
