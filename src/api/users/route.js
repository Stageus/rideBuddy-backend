import express from 'express';
import {
  userGoogleLogin,
  googleCreateToken,
  deleteuser,
  register,
  duplicateId,
  mailSendregister,
  duplicateMail
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
import wrapController from '#utility/wrapper.js';
const router = express.Router();

router.post('/login/local', wrapController(validateRegx), wrapController(localCreateToken)); //localCreateToken
router.post('/login/naver', wrapController(naverLogin));
router.get('/login/naver/callback', wrapController(naverCreateToken));
router.get('/login/google', wrapController(userGoogleLogin)); //완료
router.get('/google/callback', wrapController(googleCreateToken)); //createToken 없앴음
router.get('/find-id', wrapController(validateRegx));
router.put('/change-pw', wrapController(validateRegx)); //db에 True가 되어있어야함 checkMailStatus, changePw
router.put('/change-pw/mypages', wrapController(verifyLoginToken), wrapController(validateRegx), wrapController(changePw));
router.get('/duplicate-id', wrapController(validateRegx), wrapController(duplicateId));
router.get('/duplicate-mail', wrapController(validateRegx), wrapController(duplicateMail));
router.post('/register', wrapController(validateRegx), wrapController(duplicateId) , wrapController(duplicateMail), wrapController(checkMailStatus), wrapController(register));
router.post('/mail', wrapController(validateRegx), wrapController(mailSendregister)); //code랑 mailToken 생성해서 db에 저장
router.post('/mail/withId', validateRegx); //code랑 mailToken 생성해서 db에 저장
router.get('/mail/check', verifyMailToken, validateRegx); // db에 저장한거 True로 수정
router.delete('/my', verifyLoginToken, deleteuser);

export default router;

