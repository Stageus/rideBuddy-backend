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
  duplicateMail
} from './tj/service.js';

import { localCreateToken, naverLogin, naverCreateToken, findId, changePw } from './yr/service.js';
import { verifyLoginToken } from '#middleware/verifyLoginToken.js';
import { verifyMailToken } from './middleware/verifyMailToken.js';
import { validateRegx } from '#middleware/validateRegx.js';
import checkMailStatus from './middleware/checkMailStatus.js';
import { idRegx, pwRegx, nameRegx, mailRegx, codeRegx } from '#utility/regx.js';
const router = express.Router();
// prettier-ignore
router.post('/login/local',validateRegx([['id', idRegx],['pw', pwRegx]]),localCreateToken);
router.post('/login/naver', naverLogin);
router.get('/login/naver/callback', naverCreateToken);
router.get('/login/google', userGoogleLogin);
router.get('/google/callback', googleCreateToken);
// prettier-ignore
router.get('/find-id',validateRegx([['name', nameRegx],['mail', mailRegx]]),findId);
router.put('/change-pw', validateRegx([['pw', pwRegx]]), checkMailStatus, changePw); //db에 True가 되어있어야함 checkMailStatus, changePw
router.put('/change-pw/mypages', verifyLoginToken, validateRegx, changePw); //
router.get('/duplicate-id', validateRegx([['id', idRegx]]), duplicateId);
router.get('/duplicate-mail', validateRegx([['mail', mailRegx]]), duplicateMail);
// prettier-ignore
router.post('/register',validateRegx([['id', idRegx],['pw', pwRegx],['name', nameRegx],['mail', mailRegx]]),
  checkMailStatus,
  register
);
router.post('/mail', validateRegx([['mail', mailRegx]]), mailSendregister); //code랑 mailToken 생성해서 db에 저장
// prettier-ignore
router.post('/mail/withId',validateRegx([['mail', mailRegx],['id', idRegx]]),mailSendChangePw); //code랑 mailToken 생성해서 db에 저장
router.get('/mail/check', verifyMailToken, validateRegx([['code', codeRegx]]), mailCheck); // db에 저장한거 True로 수정
router.delete('/my', verifyLoginToken, deleteuser);
>>>>>>> dev

export default router;
