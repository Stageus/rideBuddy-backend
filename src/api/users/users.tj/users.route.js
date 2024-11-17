import express from 'express';
import {
  googleAuth,
  googleCallback,
  register,
  duplicate_id,
  duplicate_tell,
} from './users.service.js';

const router = express.Router();

// Google OAuth 시작
router.get('/google', googleAuth);

// Google OAuth 콜백 처리
router.get('/google/callback', googleCallback);

//로컬 로그인

router.post('/login/local');
router.post('/login/naver', userNaverLogin);
router.post('/login/google');
router.get('/fine-id');
router.put('/fine-pw');
router.get('/duplicate-id');
router.get('/duplicate-tell');
router.put('/tell');
router.post('/register');
router.post('/mail');
router.get('/mail/check');
router.delete('/my');

export default router;
