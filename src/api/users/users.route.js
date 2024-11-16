import { Router } from 'express';
const router = Router();
import {
  userNaverLogin,
  userNaverToken,
  userNaverProfile,
} from './users.service.js';

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
