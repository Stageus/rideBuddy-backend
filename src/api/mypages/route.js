import express from 'express';
import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { getMyInfo } from './service.js';
const router = express.Router();

router.get('/mypages', verifyLoginToken, getMyInfo); // 내 정보 불러오기
router.post('/mypages/profile', verifyLoginToken); // 프로필 사진 업로드
router.get('/mypages/profile/list', verifyLoginToken); // 프로필 히스토리 불러오기
router.delete('/mypages/profile', verifyLoginToken); // 프로필 사진 삭제
router.get('/mypages/roads/like-list', verifyLoginToken);
router.get('/mypages/center/like-list', verifyLoginToken);

export default router;
