import axios from 'axios';
import pool from '../../../config/postgresql.js';
import qs from 'qs';
import {
  checkGoogleId,
  selectGoogleAccountIdx,
  insertGoogleId,
  checkDuplicateId,
  registerdb,
} from './users.repository.js';
import jwt from 'jsonwebtoken';

//구글 오어뜨 페이지로 이동
export const userGoogleLogin = (req, res, next) => {
  // 안예뻐 , 수정하기도 번거로와 템플릿 리터럴로 수정하기
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${process.env.GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}`;
  // 필수 옵션.
  url += '&response_type=code';
  url += '&scope=email profile';
  res.redirect(url);
};

export const userGoogleCallback = async (req, res, next) => {
  const code = req.query.code;
  const resp = await axios.post(
    process.env.GOOGLE_TOKEN_URL,
    qs.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URL,
      grant_type: 'authorization_code',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  const accessToken = resp.data.access_token;

  const userInfo = await axios.get(process.env.GOOGLE_INFORMATION_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const googleName = userInfo.data.name;
  const googleId = userInfo.data.id;
  console.log(googleName, googleId);

  const checkResults = await pool.query(checkGoogleId, [googleId]);

  // 구글 식별자 아이디가 없으면 db에 추가
  if (checkResults.rows.length == 0) {
    await pool.query(insertGoogleId, [googleName, googleId]);
  }

  const idxResults = await pool.query(selectGoogleAccountIdx, [googleId]);
  const DbAccountIdx = idxResults.rows[0].account_idx;

  req.account_idx = DbAccountIdx;
  next();
};

export const register = async (req, res, next) => {
  const id = req.body.id;
  const account_name = req.body.account_name;
  const pw = req.body.pw;
  const mail = req.body.mail;

  // 정규표현식 완료후

  //아이디 중복여부 체크
  const checkResultsId = await pool.query(checkDuplicateId, [id]);
  if (checkResultsId.rows.length > 0) {
    return res.status(409).send({ message: '아이디가 중복됨' });
  }

  //db에 값 넣기기
  await pool.query(registerdb, [id, account_name, pw, mail]);
  console.log();
};

export const duplicateId = async (req, res, next) => {
  const id = req.body.id;
  // 정규표현식 완료 후

  const checkResults = await pool.query(checkDuplicateId, [id]);
  if (checkResults.rows.length > 0) {
    return res.status(409).send({ message: '이미 사용중인 id' });
  }
  return res.status(200).send();
};

export const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded.idx; // JWT에서 회원 식별자 추출
  } catch (error) {
    throw new Error('Invalid Token');
  }
};

export const deleteuser = async (req, res, next) => {
  //올바른 jwt 토큰인지 확인

  //누구꺼 refreshtoken 인지 인식
  const idx = verifyToken(res.cookie('access_token'));
  console.log(idx);

  //await pool.query(deleteaccount,[])
};
