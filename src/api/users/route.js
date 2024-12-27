import express from 'express';
import {
  userGoogleLogin,
  userGoogleCallback,
  deleteuser,
  register,
  duplicateId,
} from './tj/service.js';

import {
  localCreateToken,
  naverLogin,
  naverCreateToken,
} from './yr/service.js';

import { verifyToken } from '#middleware/verifyToken.js';

const router = express.Router();

router.post('/login/local', localCreateToken); //checkRegx 해야해
router.post('/login/naver', naverLogin);
router.get('/login/naver/callback', naverCreateToken);
router.get('/google', userGoogleLogin); //완료
//router.get('/google/callback', userGoogleCallback, createToken); //createToken 없앴음
router.get('/find-id');
router.put('/change-pw');
router.put('/change-pw/mypages');
router.get('/duplicate-id', duplicateId);
//메일 중복체크 라우터 추가하기
router.post('/register', register);
router.post('/mail');
router.post('/mail/withId');
router.get('/mail/check');
router.delete('/my', verifyToken); //deleteuser

export default router;
