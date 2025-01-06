import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { genAccessToken } from '../utility/generateToken.js';
import { verifyJWT } from '#utility/verifyJWT.js';
import wrap from '#utility/wrapper.js';
// 토큰이 유효한지 체크 ,로컬 액세스 토큰 만료시 갱신후 반환
export const verifyLoginToken = wrap(async (req, res, next) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  const accessResult = await verifyJWT('access', accessToken);
  console.log('access결과', accessResult);

  //토큰 만료가 아닌 다른에러라면
  const errorName = ['JsonWebTokenError', 'NotBeforeError'];
  for (const error of errorName) {
    if (accessResult.errName === error) next(accessResult.err);
    // if (refreshResult.errName === error) next(refreshResult.err);
  }

  //(1) access token 비만료, -> 갱신할 필요 없음.
  if (accessResult.errName === null) {
    req.decoded = accessResult.decoded;
    //next();
    res.send();
  }
  //(2) access token 만료, refresh token 만료 -> 로그인 다시
  else if (refreshResult.errName === 'TokenExpiredError') {
    next(err); //리프레쉬 토큰 만료라고 보내줘야 할것 같다.
  }
  //(3) access token 만료, refresh token 비만료 -> access token 갱신
  else {
    // 갱신
    console.log('여기로 온구');
    // 1. 리프레쉬토큰의 account_idx 얻어서
    const refreshSecretKey = process.env.JWT_REFRESHTOKEN_SECRET;
    const decoded = jwt.verify(refreshToken, refreshSecretKey);
    // 2. 다시 genAccessToken 하면 됨.
    const newAccessToken = genAccessToken(decoded.accountIdx);
    //응답헤더에 accessToken 보내기
    res.set('new_access_token', newAccessToken);
    req.headers.authorization = `Bearer ${newAccessToken}`; // req의 authorization을 갱신함.
    req.decoded = decoded;
    next();
  }
});

// refresh token 의 효용성이 딱히 없 다
// refresh token을 지 우 자
// access token 24h
