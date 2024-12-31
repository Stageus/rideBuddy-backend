import axios from 'axios';
import pool from '#config/postgresql.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import {
  selectUserPw,
  selectLocalAccountIdx,
  insertPw,
  updatePw,
} from './repository.js';
import { genAccessToken, genRefreshToken } from '../utility/generateToken.js';
import { userNaverProfile } from '../utility/naverOauth.js';
import { verifyJWT } from '#utility/verifyJWT.js';

// 네이버 로그인 화면 띄우기
export const naverLogin = (req, res) => {
  const NAVER_STATE = Math.random().toString(36).substring(2, 12);

  const loginWindow =
    `https://nid.naver.com/oauth2.0/authorize?` +
    `response_type=code` +
    `&client_id=${process.env.NAVER_CLIENT_ID}` +
    `&state=${NAVER_STATE}` +
    `&redirect_uri=${process.env.NAVER_CALLBACK_URL}`;

  res.send(loginWindow);
};

// 네이버 토큰발급 요청후 로직거쳐 localToken 발급
export const naverCreateToken = async (req, res) => {
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

  const accessToken = genAccessToken(DbAccountIdx);
  const refreshToken = genRefreshToken(DbAccountIdx);
  // 프론트 전달
  res.status(200).json({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
};

export const localCreateToken = async (req, res) => {
  const userId = req.body.id;
  const userPw = req.body.pw;
  const saltRounds = 10;

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

export const changePw = async (req, res, next) => {
  // 메일 토큰이 true 가 아니면 에러핸들러로
  // 여기 작성 필요

  const accountIdx = req.decoded;
  const newPw = req.body.pw;
  const saltRounds = 10;

  bcrypt.hash(userPw, saltRounds).then(async function (hash) {
    await pool.query(updatePw, [hash, accountIdx]);
  });
  // 돌아가는지 검사해보기

  // 생각을 멈추지 말고
  // 생각의 반례를 생각하자
  // 왜 검증이 필요하지? 검증이 필요한 이유는 프론트에서 조작할 수 있기 때문이잖아.
  // 근데 우리가 만든건데 조작 가능성은 없지 않나?
  // 이렇게
};
