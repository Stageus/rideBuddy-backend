import axios from 'axios';
import pool from '../../../config/postgresql.js';
import bcrypt from 'bcrypt';
import {
  checkNaverId,
  insertNaverId,
  selectUserPw,
  selectNaverAccountIdx,
  selectLocalAccountIdx,
  insertPw,
} from './users.repository.js';
import {
  genAccessToken,
  genRefreshToken,
} from '../../../module/util/generateToken.js';

// local jwt 생성 후 반환
export const createToken = async (account_idx) => {
  try {
    const accessToken = genAccessToken;
    const refreshToken = genRefreshToken;

    return accessToken, refreshToken;
  } catch (err) {
    // 500에러
  }
};

// local 액세스 토큰만료시 갱신 후 반환
export const renewAccessToken = async (req, res, next) => {};

// 리프레이쉬 토큰 만료시

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

// 네이버 토큰발급 요청후 액세스 토큰으로 식별자 얻고 db에 저장 or 확인하고 jwt와 함께 응답.
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
  userNaverProfile(response.data.access_token);

  res.send();
  // res.set({
  //   Content_type: 'text/plain',
  //   refresh_token: `${response.data.refresh_token}`,
  // });
  // res.cookie('access_token', `${response.data.access_token}`);
  // res.status(200).send();
};

// 네이버 액세스토큰으로 식별자 얻기
export const userNaverProfile = async (access_token) => {
  const identifierURL = `https://openapi.naver.com/v1/nid/me?`;

  const personalInfo = await axios({
    method: 'GET',
    url: identifierURL,
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const naverName = personalInfo.data.response.name;
  const naverId = personalInfo.data.response.id;
  // if (naverName && naverId) {
  //   userDBCheck(naverName, naverId);
  // } -> 여기 예외처리 해야함.
  userNaverDBCheck(naverName, naverId);
};

// 네이버 식별자 데이터 베이스에 저장 or 확인
export const userNaverDBCheck = async (naverName, naverId) => {
  const userName = naverName;
  const userAuthId = naverId;

  // 해당 네이버식별자 아이디가 있는지 확인
  const checkResults = await pool.query(checkNaverId, [userAuthId]);

  // 네이버 식별자 아이디가 없으면 db에 추가
  if (checkResults.rows.length == 0) {
    await pool.query(insertNaverId, [userName, userAuthId]);
  }

  // 네이버 식별자 아이디에 해당하는 account_idx 가져오기
  const idxResults = await pool.query(selectNaverAccountIdx, [userAuthId]);
  const account_idx = idxResults.rows[0].account_idx;

  //localJWT 발급

  //createToken(account_idx);
  // 가독성 좇창났네 시발
  //const { accessToken, refreshToken } = createToken();
  // createToken jwt에 뭘 넣지??? -> account_idx
  //
  // 이거 마무리하고 돌아가는지 확인하고 commit 하기
  // wrapper 적용하고 돌아가는지 확인해야함.

  // 커밋하기 올리기
};

export const userLocalDBCheck = async (req, res) => {
  const userId = req.body.id;
  const userPw = req.body.pw;

  const saltRounds = 10;
  // 지금은 회원가입이아니라 로그인이니까,,
  // 1. db에서 id에 대한 해싱된 pw를 가져온다.
  //    selectPw
  // 2. 해싱된 pw와 req.body.pw와 compare해서 결과를 판단한다.
  // 3. 맞으면 createToken 해서 생성된 JWT 토큰과 함께 200상태코드를 보낸다.
  // 4. 틀리면 상태코드 404를 보낸다. ... -> 이거 커스텀 에러로 처리 .

  // id에 해당하는 해싱된 pw 불러오기
  const pwResults = await pool.query(selectUserPw, [userId]);
  const pwHash = pwResults.rows[0].pw;

  // db의 pw와 userPw가 같은지 검증한다.
  bcrypt.compare(userPw, pwHash).then(async function (result) {
    if (result == true) {
      // 로컬 아이디에 해당하는 account_idx 가져오기
      const idxResults = await pool.query(selectLocalAccountIdx, [userId]);
      const account_idx = idxResults.rows[0].account_idx;

      //createToken(account_idx);
    } else {
      res.statusCode(404).send();
    }
  });
};
