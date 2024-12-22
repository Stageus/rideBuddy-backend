import axios from 'axios';
import pool from '../../../config/postgresql.js';
import bcrypt from 'bcrypt';
import { selectUserPw, selectLocalAccountIdx } from './users.repository.js';
import { genAccessToken, genRefreshToken } from '../../../module/util/token.js';
import { userNaverProfile } from '../../../module/util/naverOauth.js';

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

export const userLocalDBCheck = async (req, res, next) => {
  const userId = req.body.id;
  const userPw = req.body.pw;

  const saltRounds = 10;

  //  더미데이터
  // yiryung 1234
  // 일단 db에 넣기 위해서 이걸 쓴다.
  bcrypt.hash(userPw, saltRounds).then(async function (hash) {
    await pool.query(insertPw, [userId, hash, '정이령']);
  });

  // id에 해당하는 해싱된 pw 불러오기
  const pwResults = await pool.query(selectUserPw, [userId]);
  const pwHash = pwResults.rows[0].pw;

  // db의 pw와 userPw가 같은지 검증한다.
  // bcrypt.compare(userPw, pwHash).then(async function (result) {
  //   if (result == true) {
  //     // 로컬 아이디에 해당하는 account_idx 가져오기
  //     const idxResults = await pool.query(selectLocalAccountIdx, [userId]);
  //     const account_idx = idxResults.rows[0].account_idx;

  //     // req 객체에 account_idx 추가 하여 createToken 미들웨어로 전달.
  //     req.account_idx = account_idx;
  //     next();
  //   } else {
  //     res.status(404).send();
  //   }
  // });
};

// local jwt 생성 후 반환
export const createToken = async (req, res) => {
  try {
    const accessToken = genAccessToken(req.account_idx);
    const refreshToken = genRefreshToken(req.account_idx);

    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);

    res.cookie('access_token', `${accessToken}`, {
      httpOnly: false,
      sameSite: 'Strict',
    });
    res.cookie('refresh_token', `${refreshToken}`, {
      httpOnly: true,
      samesite: 'Strict',
    });

    res.status(200).send();
  } catch (err) {
    // 500에러
  }
};

// 토큰이 유효한지 체크 ,
// 로컬 액세스 토큰 만료시 갱신후 반환
export const verifyToken = async (req, res, next) => {
  //(1) access token 만료, refresh token 만료 -> 로그인 다시
  //(2) access token 만료, refresh token 비만료 -> access token 갱신
  //(3) access token 비만료, -> 갱신할 필요 없음.
  // 1. header에 있는 access token 과 cookie에 있는 refresh token을 추출한다.
  console.log(req.cookies);
  // 2. access token이 만료되었는지 확인한다.
  // 3. refresh token이 만료되었는지 확인한다.
  // 4. (1)인경우 다시 로그인
  // 5. (2)인 경우 access token 갱신한다.
  // 6. (3)인경우, access token 갱신할 필요가 없다.
};
