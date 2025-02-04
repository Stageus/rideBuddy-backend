import 'dotenv/config';
import { verifyJWT } from '#utility/verifyJWT.js';
import wrap from '#utility/wrapper.js';
// 3분내에 인증을 원하는 개인인지 확인필요

// 토큰이 유효한지 체크
export const verifyMailToken = wrap(async (req, res, next) => {
  const mailToken = req.body['mail_token'];

  const mailResult = verifyJWT('mail', mailToken);
  next();
});
