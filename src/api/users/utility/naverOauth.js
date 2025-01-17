import { checkNaverId, insertNaverId, selectNaverAccountIdx } from '../yr/repository.js';

import axios from 'axios';
import pool from '#config/postgresql.js';

// 네이버 액세스토큰으로 식별자 얻기
export const userNaverProfile = async (naverAccessToken) => {
  const identifierURL = `https://openapi.naver.com/v1/nid/me?`;

  const personalInfo = await axios({
    method: 'GET',
    url: identifierURL,
    headers: {
      Authorization: `Bearer ${naverAccessToken}`,
    },
  });

  const naverName = personalInfo.data.response.name;
  const naverId = personalInfo.data.response.id;

  const DbAccountIdx = userNaverDBCheck(naverName, naverId);
  return DbAccountIdx;
};

// 네이버 식별자 데이터 베이스에 저장 or 확인
export const userNaverDBCheck = async (naverName, naverId) => {
  const userName = naverName;
  const userAuthId = naverId;

  // 해당 네이버식별자 아이디가 있는지 확인
  const checkResults = await pool.query(checkNaverId, [userAuthId]);

  // 네이버 식별자 아이디가 없으면 db에 추가
  if (checkResults.rows.length == 0) {
    await pool.query(insertNaverId, [userName, userAuthId]);
  }

  // 네이버 식별자 아이디에 해당하는 account_idx 가져오기
  const idxResults = await pool.query(selectNaverAccountIdx, [userAuthId]);
  const DbAccountIdx = idxResults.rows[0].account_idx;

  return DbAccountIdx;
};
