import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { verifyJWT } from '#utility/verifyJWT.js';
import { UnauthorizedError } from '#utility/customError.js';
import wrap from '#utility/wrapper.js';
// 3분내에 인증을 원하는 개인인지 확인필요

// 토큰이 유효한지 체크
export const verifyMailToken = wrap(async (req, res, next) => {
  // wrapper 필요 mail_token으로 안올시 에러남
  console.log('verify함수 통과중');
  const mailToken = req.body['mail_token'];

  const mailResult = await verifyJWT('mail', mailToken);
  // verifyJWT가 동기이면 wrap으로 다 처리 가능.

  //토큰 만료가 아닌 다른에러라면
  // const errorName = ['JsonWebTokenError', 'NotBeforeError'];
  // for (const error of errorName) {
  if (mailResult.errName) next(mailResult.err);
  // }

  //if 모두 필요없음. .. 다 없어야함. verifyJWT 돌려서 decodeed 받아오고 후처리만 여기서 한다.
  // a 가 주는 리턴ㅇ값으로 b가 할일을 해야지. a의 값을 가지고 b의 후처리를 해줘야 그게 맞는 추상화이다.

  //1. 만료되었다면 만료되었다고
  if (mailResult.errName == 'TokenExpiredError') {
    return next(new UnauthorizedError('mail_token이 유효하지 않음.'));
  }
  //2. 검증성공시
  else {
    next();
  }
});
