import express from 'express';
import {
  userGoogleLogin,
  userGoogleCallback,
  deleteuser,
  register,
  duplicateId,
} from './tj/service.js';

import {
  userNaverLogin,
  userNaverCallback,
  userLocalDBCheck,
  createToken,
  verifyToken,
} from './yr/service.js';

const router = express.Router();

router.post('/login/local', userLocalDBCheck, createToken); //checkRegx 해야해
router.post('/login/naver', userNaverLogin);
router.get('/login/naver/callback', userNaverCallback, createToken);
router.get('/google', userGoogleLogin); //완료
router.get('/google/callback', userGoogleCallback, createToken); //완료료
router.get('/find-id');
router.put('/change-pw');
router.put('/change-pw/mypages');
router.get('/duplicate-id', duplicateId);
router.post('/register', register);
router.post('/mail');
router.post('/mail/withId');
router.get('/mail/check');
router.delete('/my', verifyToken, deleteuser);

export default router;

// Google OAuth 시작

// Google OAuth 콜백 처리
