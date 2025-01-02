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
  findId,
  changePw,
} from './yr/service.js';

import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { verifyMailToken } from './middleware/verifyMailToken.js';
import { validateRegx } from '#middleware/validateRegx.js';
import { checkMailStatus } from './middleware/checkMailStatus.js';
const router = express.Router();

router.post('/login/local', validateRegx, localCreateToken); //localCreateToken
router.post('/login/naver', naverLogin);
router.get('/login/naver/callback', naverCreateToken);
router.get('/google', userGoogleLogin); //완료
//router.get('/google/callback', userGoogleCallback, createToken); //createToken 없앴음
router.get('/find-id', validateRegx, findId);
router.put('/change-pw', validateRegx, checkMailStatus, changePw); //db에 True가 되어있어야함
router.put('/change-pw/mypages', verifyLoginToken, validateRegx, changePw);
router.get('/duplicate-id', duplicateId);
//메일 중복체크 라우터 추가하기 - 태준
router.post('/register', validateRegx, checkMailStatus, register);
router.post('/mail', validateRegx); //code랑 mailToken 생성해서 db에 저장
router.post('/mail/withId', validateRegx); //code랑 mailToken 생성해서 db에 저장
router.get('/mail/check', verifyMailToken, validateRegx); // db에 저장한거 True로 수정
router.delete('/my', verifyLoginToken, deleteuser);

export default router;
