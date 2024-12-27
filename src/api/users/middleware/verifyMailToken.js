import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { genIdentToken } from '../utility/generateToken.js';

// 5분내에 인증을 원하는 개인인지 확인필요

//jwt를 검증하는 로직 , 밑에 함수에서 필요
const verifyJWT = (token) => {
  const secretKey = process.env.JWT_IDENT_SECRET;
  // db와 통신해서 토큰이 일치하는지 알아봐야하므로
  // 1. 토큰 verify 해서 mail 빼내고
  // 2.

  // 5분있다가 어짜피 idenToken 만료되는데 굳이 생성시간을 넣어야하나?
  //

  //   let result = {
  //     errName: '',
  //     decoded: '',
  //   };

  //   jwt.verify(token, secretKey, function (err, decoded) {
  //     if (err) {
  //       result.errName = err.name;
  //       result.decoded = decoded; //undefined
  //       result.err = err;
  //     } else {
  //       result.errName = null;
  //       result.decoded = decoded;
  //     }
  //   });
  //   return result;
};

// 토큰이 유효한지 체크
export const verifyMailToken = async (req, res, next) => {
  const identToken = req.body['identification_token'];

  const identResult = verifyJWT(identToken);

  //토큰 만료가 아닌 다른에러라면
  const errorName = ['JsonWebTokenError', 'NotBeforeError'];
  for (const error of errorName) {
    if (accessResult.errNmae === error) next(accessResult.err);
    if (refreshResult.errName === error) next(refreshResult.err);
  }

  // 1. db와 통신하여 메일
};
