import express from 'express';
import { verifyLoginToken } from '#middleware/verifyLoginToken.js';

const router = express.Router();

router.get('/mypages', verifyLoginToken);
router.post('/mypages/profile', verifyLoginToken);
router.get('/mypages/profile/list', verifyLoginToken);
router.delete('/mypages/profile', verifyLoginToken);
router.get('/mypages/roads/like-list', verifyLoginToken);
router.get('/mypages/center/like-list', verifyLoginToken);

export default router;
