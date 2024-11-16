/* eslint-disable no-unused-vars */
import axios from 'axios';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

/*global process :true*/
/*eslint no-undef: "error"*/

// 네이버 로그인 화면 띄우기
export const userNaverLogin = async (req, res, next) => {
  const NAVER_STATE = Math.random().toString(36).substring(2, 12);

  res.redirect(
    `https://nid.naver.com/oauth2.0/authorize?` +
      `response_type=code` +
      `&client_id=${process.env.NAVER_CLIENT_ID}` +
      `&state=${NAVER_STATE}` + //인코딩 해야할수도 테스트해보기
      `&redirect_uri=${process.env.NAVER_CALLBACK_URL}`
  );
};

// 네이버 토큰발급 요청
export const userNaverToken = async (req, res, next) => {
  const token = axios.get('');
  // const token1;
};

// 네이버 액세스토큰으로 식별자 얻기
export const userNaverProfile = async (req, res, next) => {};

// 네이버 식별자 데이터 베이스에 저장 or 확인

// local jwt 생성 후 반환

// local 액세스 토큰만료시 갱신 후 반환
// 리프레이쉬 토큰 만료시
