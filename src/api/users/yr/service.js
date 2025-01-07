import axios from 'axios';
import pool from '#config/postgresql.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import logger from '#utility/logger.js';
import { selectUserPw, selectLocalAccountIdx, insertPw, updatePw, findAccountId } from './repository.js';
import { genAccessToken, genMailToken } from '#utility/generateToken.js';
import { userNaverProfile } from '../utility/naverOauth.js';
import wrap from '#utility/wrapper.js';
import { BadRequestError, NotFoundError } from '#utility/customError.js';

// 네이버 로그인 화면 띄우기
export const naverLogin = wrap((req, res) => {
  const NAVER_STATE = Math.random().toString(36).substring(2, 12);

  const loginWindow = `
    https://nid.naver.com/oauth2.0/authorize? 
    response_type=code
    &client_id=${process.env.NAVER_CLIENT_ID}
    &state=${NAVER_STATE}
    &redirect_uri=${process.env.NAVER_CALLBACK_URL}`;

  res.send(loginWindow);
});

// 네이버 토큰발급 요청후 로직거쳐 localToken 발급
export const naverCreateToken = wrap(async (req, res) => {
  const code = req.query.code;
  const state = req.query.string;

  const tokenUrl = `
    https://nid.naver.com/oauth2.0/token?
    grant_type=authorization_code
    &client_id=${process.env.NAVER_CLIENT_ID}
    &client_secret=${process.env.NAVER_CLIENT_SECRET}
    &code=${code} 
    &state=${state}`;

  const response = await axios.get(tokenUrl);
  const naverAccessToken = response.data.access_token;
  const DbAccountIdx = userNaverProfile(naverAccessToken);

  const accessToken = genAccessToken(DbAccountIdx);
  const refreshToken = genRefreshToken(DbAccountIdx);
  // 프론트 전달
  res.status(200).json({
    access_token: accessToken
  });
});

export const localCreateToken = wrap(async (req, res) => {
  const userId = req.body.id;
  const userPw = req.body.pw;
  const saltRounds = 10;

  // id나 pw키 자체가 안 넘어올 경우
  if (!userId || !userPw) {
    throw new BadRequestError('id또는 pw가 안넘어옴');
  }

  //id에 해당하는 해싱된 pw 불러오기
  const pwResults = await pool.query(selectUserPw, [userId]);
  const pwHash = pwResults.rows[0].pw;

  //로깅 테스트
  // try {
  //   throw new Error('응~');
  // } catch (err) {
  //   logger.error(err);
  // }

  //db의 pw와 userPw가 같은지 검증한다.
  const bcryptResult = await bcrypt.compare(userPw, pwHash);

  // userPw와 pwHash가 일치하지 않을경우
  if (!bcryptResult) {
    throw new NotFoundError('pw와 일치하지 않음');
  }
  // 로컬 아이디에 해당하는 account_idx 가져오기
  const idxResults = await pool.query(selectLocalAccountIdx, [userId]);
  const account_idx = idxResults.rows[0].account_idx;
  // access 토큰 생성
  const accessToken = genAccessToken(account_idx);

  // 프론트 전달
  res.status(200).json({
    access_token: accessToken
  });
});

export const changePw = wrap(async (req, res, next) => {
  // 메일 토큰이 true 가 아니면 에러핸들러로
  // 아직 미완성

  const accountIdx = req.decoded;
  const newPw = req.body.pw;
  const saltRounds = 10;

  const hashPw = await bcrypt.hash(newPw, saltRounds);
  await pool.query(updatePw, [hash, accountIdx]);

  // 돌아가는지 검사해보기
  res.send();
});

export const findId = wrap(async (req, res) => {
  const { name, mail } = req.body;
  const result = await pool.query(findAccountId, [name, mail]);
  const accountId = result.rows[0];
  if (result.rows.length == 0) {
    throw new NotFoundError();
  } else {
    res.status(200).send({
      account_id: accountId
    });
  }
});
