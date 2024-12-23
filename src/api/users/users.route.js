import express from 'express';

import {
  userGoogleLogin,
  userGoogleCallback,
  deleteuser,
  register,
  duplicateId,
} from './users.tj/users.service.js';

import {
  userNaverLogin,
  userNaverCallback,
  userLocalDBCheck,
  createToken,
  verifyToken,
} from './users.yr/users.service.js';
import { checkRegx } from '#util/checkRegx.js';
const router = express.Router();

// userGoogleCallback은 미들웨어이고, createToken 은 라우터.
// 3계층에 middlewar폴더 추가하는 방법 찾아보기
// 라우터는 서비스와 1대1 대응이어야해
// 미들웨어는 1대 다로 쓰일수 있어야 하고 .
// createToken은 user폴더에 middleware폴더에 넣어야 함.
//

//로컬 로그인
router.post('/login/local', userLocalDBCheck, createToken); //checkRegx 해야해
router.post('/login/naver', userNaverLogin);
router.get('/login/naver/callback', userNaverCallback, createToken);
router.get('/find-id');

router.get('/change-pw'); // 피드백
router.put('/change-pw');

// Google OAuth 시작

router.get('/google', userGoogleLogin); //완료

// Google OAuth 콜백 처리
router.get('/google/callback', userGoogleCallback, createToken); //완료료

router.get('/duplicate-id', duplicateId);

router.post('/register', register);

router.post('/mail');
router.get('/mail/check');
router.delete('/my', verifyToken, deleteuser);

export default router;
