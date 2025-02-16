import express from 'express';
import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { validateRegx } from '#middleware/validateRegx.js';
import {
  getMyInfo,
  uploadProfile,
  getMyProfile,
  deleteProfile,
  getRoadsLikeList,
  getCentersLikeList
} from './service.js';
import { upload } from '#utility/multer.js';
import { numRegx } from '#utility/regx.js';
const router = express.Router();

router.get('/', verifyLoginToken, getMyInfo); // 내 정보 불러오기
router.post('/profile', verifyLoginToken, upload.single('profile'), uploadProfile); // 프로필 사진 업로드하기
router.get('/profile/list', verifyLoginToken, getMyProfile); // 프로필 히스토리 불러오기
router.delete('/profile', verifyLoginToken, validateRegx([['img_idx', numRegx]]), deleteProfile); // 프로필 사진 삭제
router.post('/roads/like-list', verifyLoginToken, validateRegx([['page', numRegx]]), getRoadsLikeList);
router.post('/centers/like-list', verifyLoginToken, validateRegx([['page', numRegx]]), getCentersLikeList);

export default router;
