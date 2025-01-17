import axios from 'axios';
import pool from '#config/postgresql.js';
import qs from 'qs';
import sendMailUtil from '../utility/mail.js';
import {
  checkGoogleId,
  selectGoogleAccountIdx,
  insertGoogleId,
  checkDuplicateId,
  registerdb,
  checkDuplicateMail,
  mailVerifyDB,
  correctaccount,
  checkMail,
  insertMailToken,
  transMailToken_True,
  deleteaccount
} from './repository.js';
import randomNumber from '#utility/randomNumber.js';
import jwt from 'jsonwebtoken';
import smtpTransport from '#config/email.js';
import wrap from '#utility/wrapper.js';
import { genAccessToken, genMailToken } from '#utility/generateToken.js'; //genRefreshToken 삭제함
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
} from '#utility/customError.js';
// 같은 도메인내에있는건 상대경로 (서비스에서 레포 참조한다 이럴때 )
// 외부 도메인에 있는건 절대경로 shared같은 공용파일들 가져올때 절대경로로 많이 씀.

//구글 oauth
export const userGoogleLogin = wrap((req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&response_type=code&scope=email profile`;
  res.redirect(url);
});

export const googleCreateToken = wrap(async (req, res) => {
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
      grant_type: 'authorization_code'
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  //access_token 받음.
  const googleaccessToken = resp.data.access_token;

  //access_token 통해서 정보 접근
  const userInfo = await axios.get(process.env.GOOGLE_INFORMATION_URL, {
    headers: {
      Authorization: `Bearer ${googleaccessToken}`
    }
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

  // 프론트 전달
  res.status(200).json({
    access_token: accessToken,
    OAuth: true
  });
  console.log('accessToken', accessToken);
});

// 이거 고쳐
export const duplicateId = wrap(async (req, res, next) => {
  // 정규표현식 완료 후
  const id = req.body.id;
  const checkResults = await pool.query(checkDuplicateId, [id]);
  if (checkResults.rows.length > 0) {
    return next(new ConflictError('이미 사용중인 id'));
  }
  res.status(200).send({});
});

//이것도 고쳐
export const duplicateMail = wrap(async (req, res, next) => {
  // 정규표현식 완료 후
  const mail = req.body.mail;
  const checkResults = await pool.query(checkDuplicateMail, [mail]);
  if (checkResults.rows.length > 0) {
    return next(new ConflictError('이미 사용중인 mail'));
  }
  res.status(200).send({});
});

export const register = wrap(async (req, res, next) => {
  const id = req.body.id;
  const mail = req.body.mail;
  const account_name = req.body.name;
  const pw = req.body.pw;
  // destructuring이란??? id변수에 req.body.id 만들어놓으면
  // const {id, pw, mail} = req.body 이거

  const checkResultsId = await pool.query(checkDuplicateId, [id]);
  if (checkResultsId.rows.length > 0) {
    return next(new ConflictError('이미 사용중인 id'));
  }

  const checkResultsMail = await pool.query(checkDuplicateMail, [mail]);
  if (checkResultsMail.rows.length > 0) {
    return next(new ConflictError('이미 사용중인 mail'));
  }

  // token 여부 확인 후

  console.log(id);
  console.log(account_name);
  console.log(pw);
  console.log(mail);

  //db에 값 넣기기
  await pool.query(registerdb, [id, account_name, pw, mail]);
  res.status(200).send({});
});

// Register로 대문자 바꿔
export const mailSendRegister = wrap(async (req, res, next) => {
  const number = randomNumber;
  const mail = req.body.mail;
  console.log(mail);
  sendMailUtil(number, mail, res);
});

export const mailSendChangePw = wrap(async (req, res, next) => {
  const number = randomNumber;
  const mail = req.body.mail;
  const id = req.body.id;
  //id 와 email 일치 여부 확인
  const correctResult = await pool.query(correctaccount, [id, mail]);
  if (correctResult.rows.length == 0) {
    return next(new NotFoundError('해당하는 계정이 없음.'));
  }

  sendMailUtil(number, mail, res);
});

export const mailCheck = wrap(async (req, res, next) => {
  const mail_token = req.body.mail_token;
  const code = req.body.code;
  console.log('mail 토큰 : ', mail_token);
  console.log('code : ', code);

  const correctResult = await pool.query(mailVerifyDB, [mail_token, code]);
  if (correctResult.rows.length == 0) {
    return next(new NotFoundError('메일, 인증코드와 일치하는 데이터 없음.')); // 제한시간이 넘어갔다는건 verifymailToken에서 해주는 것임.
  }
  //true 로 바꾸기
  console.log('mailCheck 통과중2');
  await pool.query(transMailToken_True, ['TRUE', mail_token, code]);
  return res.status(200).send({ message: 'finish' });
});

export const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded.idx; // JWT에서 회원 식별자 추출
  } catch (error) {
    throw new Error('Invalid Token');
  }
};
// verifyJWT로 코드 고치기

export const deleteuser = wrap(async (req, res, next) => {
  //올바른 jwt 토큰인지 확인
  console.log(req.cookies);
  console.log(process.env.JWT_ACCESSTOKEN_SECRET);

  try {
    const decoded = jwt.verify(req.cookies['access_token'], process.env.JWT_ACCESSTOKEN_SECRET);
    const idx = decoded.accountIdx;
    console.log(idx);
    await pool.query(deleteaccount, [idx]);
  } catch (error) {
    throw new Error('Invalid Token');
  }

  // 누구꺼 refreshtoken 인지 인식

  return res.status(200).send({});
});
