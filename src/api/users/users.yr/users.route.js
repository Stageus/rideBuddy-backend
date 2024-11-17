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
router.get('/fine-id');
router.put('/fine-pw');
router.put('/tell');

export default router;
