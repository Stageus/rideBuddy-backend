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
  userNaverLogin,
  userNaverCallback,
  userLocalDBCheck,
  createToken,
  verifyToken,
} from './yr/service.js';

const router = express.Router();

router.post('/login/local', localCreateToken); //checkRegx 해야해
router.post('/login/naver', userNaverLogin);
router.get('/login/naver/callback', userNaverCallback, createToken);
router.get('/google', userGoogleLogin); //완료
router.get('/google/callback', userGoogleCallback, createToken); //완료료
router.get('/find-id');
router.put('/change-pw');
router.put('/change-pw/mypages');
router.get('/duplicate-id', duplicateId);
//메일 중복체크 라우터 추가하기
router.post('/register', register);
router.post('/mail');
router.post('/mail/withId');
router.get('/mail/check');
router.delete('/my', verifyToken, deleteuser);

export default router;
