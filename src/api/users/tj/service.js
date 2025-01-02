import axios from 'axios';
import pool from '#config/postgresql.js';
import qs from 'qs';
import {
  checkGoogleId,
  selectGoogleAccountIdx,
  insertGoogleId,
  checkDuplicateId,
  registerdb,
  checkDuplicateMail,
  mailVerifyDB,
} from './repository.js';
import randomNumber from '#utility/randomNumber.js';
import jwt from 'jsonwebtoken';
import smtpTransport from '#config/email.js';
import { genAccessToken, genRefreshToken } from '../utility/generateToken.js';

//구글 oauth
export const userGoogleLogin = (req, res, next) => {
  const url =
    'https://accounts.google.com/o/oauth2/v2/auth' +
    `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}` +
    '&response_type=code' +
    '&scope=email profile';
  res.redirect(url);
};

export const googleCreateToken = async (req, res, next) => {
  //google로부터 코드 발급
  const code = req.query.code;
  //google로 발급받은 코드 전송
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
  //access_token 받음.
  const googleaccessToken = resp.data.access_token;

  //access_token 통해서 정보 접근
  const userInfo = await axios.get(process.env.GOOGLE_INFORMATION_URL, {
    headers: {
      Authorization: `Bearer ${googleaccessToken}`,
    },
  });
  //name id 습득
  const googleName = userInfo.data.name;
  const googleId = userInfo.data.id;
  console.log(googleName, googleId);

  const checkResults = await pool.query(checkGoogleId, [googleId]);

  // 구글 식별자 아이디가 없으면 db에 추가
  if (checkResults.rows.length == 0) {
    await pool.query(insertGoogleId, [googleName, googleId]);
  }
  //idx 얻어오기
  const idxResults = await pool.query(selectGoogleAccountIdx, [googleId]);
  const DbAccountIdx = idxResults.rows[0].account_idx;

  const accessToken = genAccessToken(DbAccountIdx);
  const refreshToken = genRefreshToken(DbAccountIdx);
  res.status(200).json({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  console.log('accessToken', accessToken, 'refreshToken', refreshToken);
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

export const mailregx = async (req, res, next) => {
  const mail = req.mail;
  const checkResults = await pool.query(checkDuplicateMail, [mail]);
  if (checkResults.rows.length > 0) {
    return res.status(409).send({ message: '이메일이 중복됨' });
  }
};

export const mailSendregister = async (req, res, next) => {
  const number = randomNumber;
  const email = req.body.email;
  const mailOptions = {
    from: process.env.MAIL_ID + '@naver.com',
    to: email,
    subject: '인증 관련 메일 입니다.',
    html: '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + number,
  };
  smtpTransport.sendMail(mailOptions, async (err, response) => {
    console.log('response', response);
    console.log('response', email);
    if (err) {
      res.json({ ok: false, msg: '메일 전송 실패' });
      smtpTransport.close();
      return;
    } else {
      const token = genMailToken;
      res.status(200).send({ mail_token: token });
      //저장
      await pool.query(insertMailToken, [token, number, False]);

      smtpTransport.close();
      return;
    }
  });
};

export const mailSendPw = async (req, res, next) => {
  const number = randomNumber;
  const email = req.body.email;
  const id = req.body.id;
  const mailOptions = {
    from: process.env.MAIL_ID + '@naver.com',
    to: email,
    subject: '인증 관련 메일 입니다.',
    html: '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + number,
  };
  smtpTransport.sendMail(mailOptions, async (err, response) => {
    console.log('response', response);
    console.log('response', email);
    if (err) {
      res.json({ ok: false, msg: '메일 전송 실패' });
      smtpTransport.close();
      return;
    } else {
      const token = genMailToken;
      res.status(200).send({ mail_token: token });
      //저장
      await pool.query(insertMailToken, [token, number, False]);

      smtpTransport.close();
      return;
    }
  });
};

export const mailVerify = async (req, res, next) => {
  const mail_token = req.body.mail_token;
  const code = req.body.code;
  const checkResults = await pool.query(mailVerifyDB, [mail_token, code]);
  if (checkResults.rows.length > 0) {
    await pool.query(modifyMailToken, [True, mail_token]);
  }
};
