import express from 'express';
import {
  userGoogleLogin,
  googleCreateToken,
  deleteuser,
  register,
  duplicateId,
  mailSendregister,
  mailSendChangePw,
  mailCheck,
  duplicateMail,
} from './tj/service.js';

import { localCreateToken, naverLogin, naverCreateToken, findId, changePw } from './yr/service.js';

import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { verifyMailToken } from './middleware/verifyMailToken.js';
import { validateRegx } from '#middleware/validateRegx.js';
import checkMailStatus from './middleware/checkMailStatus.js';

const router = express.Router();

router.post('/login/local', validateRegx, localCreateToken);
router.post('/login/naver', naverLogin);
router.get('/login/naver/callback', naverCreateToken);
router.get('/login/google', userGoogleLogin);
router.get('/google/callback', googleCreateToken);
router.get('/find-id', validateRegx, findId);
router.put('/change-pw', validateRegx, checkMailStatus, changePw); //db에 True가 되어있어야함 checkMailStatus, changePw
router.put('/change-pw/mypages', verifyLoginToken, validateRegx, changePw); //
router.get('/duplicate-id', validateRegx, duplicateId);
router.get('/duplicate-mail', validateRegx, duplicateMail);
router.post('/register', validateRegx, checkMailStatus, register);
router.post('/mail', validateRegx, mailSendregister); //code랑 mailToken 생성해서 db에 저장
router.post('/mail/withId', validateRegx, mailSendChangePw); //code랑 mailToken 생성해서 db에 저장
router.get('/mail/check', verifyMailToken, validateRegx, mailCheck); // db에 저장한거 True로 수정
router.delete('/my', verifyLoginToken, deleteuser);

export default router;
