import express from 'express';
import { verifyToken } from '#middleware/verifyToken.js';

const router = express.Router();

router.get('/mypages', verifyToken);
router.post('/mypages/profile', verifyToken);
router.get('/mypages/profile/list', verifyToken);
router.delete('/mypages/profile', verifyToken);
router.get('/mypages/roads/like-list', verifyToken);
router.get('/mypages/center/like-list', verifyToken);

export default router;
