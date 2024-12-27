import axios from 'axios';
import pool from '#config/postgresql.js';
import bcrypt from 'bcrypt';

import { selectUserPw, selectLocalAccountIdx, insertPw } from './repository.js';
import {
  genAccessToken,
  genRefreshToken,
  verifyResult,
} from '#middleware/token.js';
// import { userNaverProfile } from '#util/naverOauth.js';
import 'dotenv/config';

// 네이버 로그인 화면 띄우기
export const userNaverLogin = (req, res, next) => {
  const NAVER_STATE = Math.random().toString(36).substring(2, 12);

  const loginWindow =
    `https://nid.naver.com/oauth2.0/authorize?` +
    `response_type=code` +
    `&client_id=${process.env.NAVER_CLIENT_ID}` +
    `&state=${NAVER_STATE}` +
    `&redirect_uri=${process.env.NAVER_CALLBACK_URL}`;

  res.send(loginWindow);
};

// 네이버 토큰발급 요청후 액세스 토큰으로 식별자 얻고 db에 저장 or 확인하고 db의 account_idx req에 추가
export const userNaverCallback = async (req, res, next) => {
  const code = req.query.code;
  const state = req.query.string;

  const tokenUrl =
    `https://nid.naver.com/oauth2.0/token?` +
    `grant_type=authorization_code` +
    `&client_id=${process.env.NAVER_CLIENT_ID}` +
    `&client_secret=${process.env.NAVER_CLIENT_SECRET}` +
    `&code=${code}` +
    `&state=${state}`;

  const response = await axios.get(tokenUrl);
  const naverAccessToken = response.data.access_token;
  const DbAccountIdx = userNaverProfile(naverAccessToken);

  req.account_idx = DbAccountIdx;
  next();
};

export const localCreateToken = async (req, res, next) => {
  const userId = req.body.id;
  const userPw = req.body.pw;

  const saltRounds = 10;

  //  더미데이터
  // yiryung 1234
  // 일단 db에 넣기 위해서 이걸 쓴다.
  // bcrypt.hash(userPw, saltRounds).then(async function (hash) {
  //   await pool.query(insertPw, [userId, hash, '정이령']);
  // });

  //id에 해당하는 해싱된 pw 불러오기
  const pwResults = await pool.query(selectUserPw, [userId]);
  const pwHash = pwResults.rows[0].pw;

  //db의 pw와 userPw가 같은지 검증한다.
  bcrypt.compare(userPw, pwHash).then(async function (result) {
    if (result == true) {
      // 로컬 아이디에 해당하는 account_idx 가져오기
      const idxResults = await pool.query(selectLocalAccountIdx, [userId]);
      const account_idx = idxResults.rows[0].account_idx;
      // access, refresh 토큰 생성
      const accessToken = genAccessToken(account_idx);
      const refreshToken = genRefreshToken(account_idx);
      // 프론트 전달
      res.status(200).json({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } else {
      res.status(404).send();
    }
  });
};

// local jwt 생성 후 반환
// 응답을 해주면 서비스야
// 굳이 이게 필요가 없다.
// 3계층 빼자
// index.js 필요없는거 쳐내고
// 3계층 구조에서 미들웨어 구조 이상햇던거 바꾹고

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
