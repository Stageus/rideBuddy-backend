import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { genAccessToken } from '../utility/generateToken.js';
import { verifyJWT } from '#utility/verifyJWT.js';
import wrap from '#utility/wrapper.js';
// 토큰이 유효한지 체크 ,로컬 액세스 토큰 만료시 갱신후 반환
export const verifyLoginToken = wrap(async (req, res, next) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  const accessResult = await verifyJWT('access', accessToken);

  //토큰 만료가 아닌 다른에러라면
  const errorName = ['JsonWebTokenError', 'NotBeforeError'];
  for (const error of errorName) {
    if (accessResult.errName === error) next(accessResult.err);
  }

  //(1) access token 비만료, -> 갱신할 필요 없음.
  if (accessResult.errName === null) {
    req.accountIdx = accessResult.decoded;
    next();
  }
  //(2) access token 만료-> 로그인 다시
  else if (accessResult.errName === 'TokenExpiredError') {
    throw new UnauthorizedError('토큰만료, 다시 로그인필요');
  }
});
