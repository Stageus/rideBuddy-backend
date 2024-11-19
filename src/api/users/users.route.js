import express from 'express';
import { googleAuth, googleCallback } from './users.tj/users.service.js';
import {
  userNaverLogin,
  userNaverCallback,
  userNaverProfile,
} from './users.yr/users.service.js';

const router = express.Router();

//로컬 로그인
router.post('/login/local');
router.post('/login/naver', userNaverLogin);
router.get('/login/naver/callback', userNaverCallback);
router.post('/login/naver/profile', userNaverProfile);
router.get('/fine-id');
router.put('/fine-pw');
router.put('/tell');

// Google OAuth 시작
router.get('/google', googleAuth);

// Google OAuth 콜백 처리
router.get('/google/callback', googleCallback);

router.get('/duplicate-id');
router.get('/duplicate-tell');
router.post('/register');
router.post('/mail');
router.get('/mail/check');
router.delete('/my');

export default router;
