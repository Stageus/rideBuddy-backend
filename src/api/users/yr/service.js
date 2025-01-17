import axios from 'axios';
import pool from '#config/postgresql.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';
// import logger from '#utility/logger.js';
import {
  selectUserPw,
  selectLocalAccountIdx,
  insertPw,
  updatePwFromId,
  updatePwFromIdx,
  findAccountId,
  selectTokenType
} from './repository.js';
import { genAccessToken, genMailToken } from '#utility/generateToken.js';
import { userNaverProfile } from '../utility/naverOauth.js';
import wrap from '#utility/wrapper.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '#utility/customError.js';

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
  // 프론트 전달
  res.status(200).json({
    access_token: accessToken,
    OAuth: true
  });
});

export const localCreateToken = wrap(async (req, res) => {
  const { id, pw } = req.body;
  const saltRounds = 10;

  // id나 pw키 자체가 안 넘어올 경우
  if (!id || !pw) {
    throw new BadRequestError('id또는 pw가 안넘어옴');
  }

  //id에 해당하는 해싱된 pw 불러오기
  const pwResults = await pool.query(selectUserPw, [id]);
  const pwHash = pwResults.rows[0].pw;

  //로깅 테스트
  // try {
  //   throw new Error('응~');
  // } catch (err) {
  //   logger.error(err);
  // }

  //db의 pw와 userPw가 같은지 검증한다.
  const bcryptResult = await bcrypt.compare(pw, pwHash);

  // userPw와 pwHash가 일치하지 않을경우
  if (!bcryptResult) {
    throw new NotFoundError('db의 pw와 일치하지 않음');
  }
  // 로컬 아이디에 해당하는 account_idx 가져오기
  const idxResults = await pool.query(selectLocalAccountIdx, [id]);
  const account_idx = idxResults.rows[0].account_idx;
  // access 토큰 생성
  const accessToken = genAccessToken(account_idx);

  // 프론트 전달
  res.status(200).json({
    access_token: accessToken
  });
});

export const changePw = wrap(async (req, res, next) => {
  let userIdx = req.accountIdx; // 마이페이지에서 비밀번호 변경시 사용
  let userId = req.body.id; // 비밀번호 변경모달창에서 변경시 사용
  let updateResult;
  const newPw = req.body.pw;

  if (!newPw) {
    throw new BadRequestError('pw를 받지못함');
  }
  const saltRounds = 10;

  const hashPw = await bcrypt.hash(newPw, saltRounds);

  // 마이페이지에서 비밀번호 변경시
  if (userIdx) {
    //oAuth로그인시 403 에러
    const result = await pool.query(selectTokenType, [userIdx]);
    const token_type = result.rows[0].token_type;
    if (!(token_type == 'local')) {
      throw new ForbiddenError('OAuth 로그인은 changePw불가 ');
    }

    updateResult = await pool.query(updatePwFromIdx, [hashPw, userIdx]);
  }
  // 비밀번호 변경모달창에서 변경시
  else if (userId) {
    updateResult = await pool.query(updatePwFromId, [hashPw, userId]);
  } else {
    throw new BadRequestError('id를 받지못함');
  }
  res.status(200).send({});
});

export const findId = wrap(async (req, res) => {
  const { name, mail } = req.body;
  if (!name || !mail) {
    throw new BadRequestError('name또는 mail이 안넘어옴');
  }

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
