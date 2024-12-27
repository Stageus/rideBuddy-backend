import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { verifyResult } from '#utility/verifyJWT.js';

// 토큰이 유효한지 체크 ,
// 로컬 액세스 토큰 만료시 갱신후 반환
export const verifyToken = async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  const accessToken = req.headers.authorization;

  const accessResult = verifyResult('access', accessToken);
  const refreshResult = verifyResult('refresh', refreshToken);

  console.log('accessResult', accessResult);
  console.log('refreshResult', refreshResult);
  //(1) access token 비만료, -> 갱신할 필요 없음.
  if (accessResult.errMessage === null) {
    next();
  }
  //(2) access token 만료, refresh token 만료 -> 로그인 다시
  else if (refreshResult.errMessage === 'jwt expired') {
    next(err);
  }
  //(3) access token 만료, refresh token 비만료 -> access token 갱신
  else {
    // 갱신
    // 1. 리프레쉬토큰의 account_idx 얻어서
    const refreshSecretKey = process.env.JWT_REFRESHTOKEN_SECRET;
    const decoded = jwt.verify(refreshToken, refreshSecretKey);
    console.log('decoded', decoded);
    // 2. 다시 genAccessToken 하면 됨.
  }
};
