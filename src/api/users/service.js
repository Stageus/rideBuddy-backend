import axios from 'axios';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import qs from 'qs';
import bcrypt from 'bcrypt';
import randomNumber from '#utility/randomNumber.js';
import wrap from '#utility/wrapper.js';
import { genAccessToken } from '#utility/generateToken.js';
import { NotFoundError, ConflictError, ForbiddenError } from '#utility/customError.js';
import pool from '#config/postgresql.js';
import {
  checkGoogleId,
  selectGoogleAccountIdx,
  insertGoogleId,
  checkDuplicateId,
  registerdb,
  checkDuplicateMail,
  mailVerifyDB,
  correctaccount,
  transMailToken_True,
  deleteaccount,
  selectUserPw,
  selectLocalAccountIdx,
  updatePwFromId,
  updatePwFromIdx,
  findAccountId,
  selectTokenType
} from './repository.js';
import { userNaverProfile } from './utility/naverOauth.js';
import sendMailUtil from './utility/mail.js';
// 같은 도메인내에있는건 상대경로 (서비스에서 레포 참조한다 이럴때 )
// 외부 도메인에 있는건 절대경로 shared같은 공용파일들 가져올때 절대경로로 많이 씀.

// ------------- 태준

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
});

export const duplicateId = wrap(async (req, res, next) => {
  // 정규표현식 완료 후
  const id = req.body.id;
  const checkResults = await pool.query(checkDuplicateId, [id]);
  if (checkResults.rows.length > 0) {
    return next(new ConflictError('이미 사용중인 id'));
  }
  res.status(200).send({});
});

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
    throw new ConflictError('이미 사용중인 id');
  }

  const checkResultsMail = await pool.query(checkDuplicateMail, [mail]);
  if (checkResultsMail.rows.length > 0) {
    throw new ConflictError('이미 사용중인 mail');
  }

  // token 여부 확인 후

  //db에 값 넣기기
  await pool.query(registerdb, [id, account_name, pw, mail]);
  res.status(200).send({});
});

export const mailSendRegister = wrap(async (req, res, next) => {
  var number = randomNumber();
  const mail = req.body.mail;
  sendMailUtil(number, mail, res);
});

export const mailSendChangePw = wrap(async (req, res, next) => {
  const number = randomNumber();
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
//지우기
// verify 동기로 그냥 쓰기
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
  const accessToken = req.headers.authorization.split(' ')[1];
  try {
    // try-catch 필요없음. wrap으로 감싸져 있으니까
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESSTOKEN_SECRET);
    const idx = decoded.accountIdx;
    await pool.query(deleteaccount, [idx]);
  } catch (error) {
    throw new Error(error);
  }
  return res.status(200).send({});
});

// --------------- 이령

// 네이버 로그인 화면 띄우기
export const naverLogin = wrap((req, res) => {
  const NAVER_STATE = Math.random().toString(36).substring(2, 12);
  const encodedState = encodeURI(NAVER_STATE);
  const encodedURI = encodeURI(process.env.NAVER_CALLBACK_URL);
  const loginWindow =
    'https://nid.naver.com/oauth2.0/authorize?response_type=code' +
    `&client_id=${process.env.NAVER_CLIENT_ID}` +
    `&state=${encodedState}` +
    `&redirect_uri=${encodedURI}`;

  res.send(loginWindow);
});

// 네이버 토큰발급 요청후 로직거쳐 localToken 발급
export const naverCreateToken = wrap(async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  const encodedState = encodeURI(state);

  const tokenUrl =
    `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code` +
    `&client_id=${process.env.NAVER_CLIENT_ID}` +
    `&client_secret=${process.env.NAVER_CLIENT_SECRET}` +
    `&code=${code}` +
    `&state=${encodedState}`;

  const response = await axios.get(tokenUrl);
  const naverAccessToken = response.data.access_token;
  const DbAccountIdx = await userNaverProfile(naverAccessToken);

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

  const pwResults = await pool.query(selectUserPw, [id]);
  const pwHash = pwResults.rows[0].pw;

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

// 비밀번호 변경모달창에서 비밀번호 변경시
export const changePw = wrap(async (req, res, next) => {
  let userId = req.body.id;
  const newPw = req.body.pw;
  const hashPw = await bcrypt.hash(newPw, 10);

  await pool.query(updatePwFromId, [hashPw, userId]);

  res.status(200).send({});
});

// 마이페이지에서 비밀번호 변경시
export const changePwInMypages = wrap(async (req, res) => {
  const userIdx = req.accountIdx;
  const newPw = req.body.pw;
  const hashPw = await bcrypt.hash(newPw, 10);

  //oAuth로그인시 403 에러
  const result = await pool.query(selectTokenType, [userIdx]);
  const token_type = result.rows[0].token_type;
  if (!(token_type == 'local')) {
    throw new ForbiddenError('OAuth 로그인은 changePw불가 ');
  }

  await pool.query(updatePwFromIdx, [hashPw, userIdx]);
  res.status(200).send({});
});

export const findId = wrap(async (req, res) => {
  const { name, mail } = req.body;
  // ** 그림그려놓고 구조에 맞게 돌아가는지 좀 보고

  const result = await pool.query(findAccountId, [name, mail]);
  const accountId = result.rows[0];
  if (result.rows.length == 0) {
    throw new NotFoundError('해당하는 id를 찾을 수 없음.');
  } else {
    res.status(200).send({
      account_id: accountId
    });
  }
});
