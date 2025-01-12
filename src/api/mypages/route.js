import express from 'express';
import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { getMyInfo, uploadProfile } from './service.js';
import { upload } from '#utility/multer.js';
const router = express.Router();

router.get('/', verifyLoginToken, getMyInfo); // 내 정보 불러오기
router.post('/profile', upload.single('profile'), uploadProfile); // 프로필 사진 업로드 //verifyLoginToken잠시 뺌
router.get('/profile/list', verifyLoginToken); // 프로필 히스토리 불러오기
router.delete('/profile', verifyLoginToken); // 프로필 사진 삭제
router.get('/roads/like-list', verifyLoginToken);
router.get('/center/like-list', verifyLoginToken);

export default router;
