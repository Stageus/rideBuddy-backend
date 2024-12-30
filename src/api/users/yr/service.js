import axios from 'axios';
import pool from '#config/postgresql.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';

import { selectUserPw, selectLocalAccountIdx, insertPw } from './repository.js';
import { genAccessToken, genRefreshToken } from '../utility/generateToken.js';
import { userNaverProfile } from '../utility/naverOauth.js';

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

export const changePw = async (req, res) => {
  //true 면 db에 pw 바꿈
};
