import express from 'express';
import {
  googleAuth,
  googleCallback,
  register,
  duplicate_id,
  duplicate_tell,
} from './users.tj/users.service.js';
import {
  userNaverLogin,
  userNaverCallback,
  userNaverProfile,
  userDBCheck,
} from './users.yr/users.service.js';

const router = express.Router();

//로컬 로그인
router.post('/login/local');
router.post('/login/naver', userNaverLogin);
router.get('/login/naver/callback', userNaverCallback);
router.get('/login/naver/profile', userNaverProfile);
router.post('/login/oauth/user/check', userDBCheck);
router.get('/fine-id');
router.put('/fine-pw');
router.put('/tell');

// Google OAuth 시작
router.get('/google', googleAuth);

// Google OAuth 콜백 처리
router.get('/google/callback', googleCallback);

router.get('/duplicate-id', duplicate_id);
router.get('/duplicate-tell', duplicate_tell);
router.post('/register', register);
router.post('/mail');
router.get('/mail/check');
router.delete('/my');

export default router;
