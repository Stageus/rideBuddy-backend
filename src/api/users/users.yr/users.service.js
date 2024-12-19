import axios from 'axios';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import pool from '../../../config/postgresql.js';
import bcrypt from 'bcrypt';
import {
  checkNaverId,
  insertNaverId,
  selectUserPw,
  selectAccountIdx,
} from './users.repository.js';

// local jwt 생성 후 반환
export const createToken = async (name) => {
  const acessToken = jwt.sign(
    {
      userName: req.name,
    },
    process.env.JWT_SECRET //
  );
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
  // response.data.access_token
  // response.data.refresh_token

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
  // }
  userNaverDBCheck(naverName, naverId);
};

// 네이버 식별자 데이터 베이스에 저장 or 확인
export const userNaverDBCheck = async (naverName, naverId) => {
  const userName = naverName;
  const userAuthId = naverId;

  const checkResults = await pool.query(checkNaverId, [userAuthId]);

  if (checkResults.rows.length == 0) {
    await pool.query(insertNaverId, [userName, userAuthId]);
  }

  const idxResults = await pool.query(selectAccountIdx, [userAuthId]);
  const account_idx = idxResults.rows[0].account_idx;

  //createToken(account_idx);
  // 가독성 좇창났네 시발
  //const { accessToken, refreshToken } = createToken();
  // createToken jwt에 뭘 넣지??? -> account_idx
  //
  // 이거 마무리하고 돌아가는지 확인하고 commit 하기
  // wrapper 적용하고 돌아가는지 확인해야함.

  // 커밋하기 올리기

  //회원정보db에 userId 있는지 확인
  //없으면 insert 후 local jwt 생성으로 이동
  //있으면 local jwt 생성으로 이동

  //있으면 local jwt 생성
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

  const dbPw = await pool.query(selectUserPw, [userId]);
  console.log('dbPw결고ㅏ', dbPw.rows);
};
