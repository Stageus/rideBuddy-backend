import wrap from '#utility/wrapper.js';
import { pool, client } from '#config/postgresql.js';
import {
  selectLoginType,
  selectInfo,
  selectProfile,
  insertProfile,
  selectHistory,
  deleteImg,
  beforeDeleteImg,
  selectUserRoad,
  selectUserCenter
} from './repository.js';
import { BadRequestError, ForbiddenError } from '#utility/customError.js';

export const getMyInfo = wrap(async (req, res) => {
  const userIdx = req.accountIdx;
  const result = await pool.query(selectLoginType, [userIdx]);
  console.log('mypage getMyInfo 결과', result.rows[0]);
  const userLoginType = result.rows[0].token_type;
  let img_url;

  // 기본정보
  const infoResult = await pool.query(selectInfo, [userIdx]);
  const { account_name, id, mail } = infoResult.rows[0];
  // 현재 프로필 이미지
  const profileResult = await pool.query(selectProfile, [userIdx]);
  if (!profileResult.rows[0]) {
    // 프로필이미지를 업로드 하지 않았을경우 null반환
    img_url = null;
  } else {
    img_url = profileResult.rows[0].img_url;
  }

  res.status(200).send({
    account_name: account_name,
    id: id,
    mail: mail,
    img_url: img_url
  });
});

// 프로필 사진 업로드
export const uploadProfile = wrap(async (req, res) => {
  const userIdx = req.accountIdx;
  if (!req.file) {
    throw new BadRequestError('첨부된 파일이 없음');
  }
  const fileURL = req.file.location;
  await pool.query(insertProfile, [userIdx, fileURL]);

  res.status(200).send({});
});

// 사용자가 넣은 프로필 히스토리 불러오기
export const getMyProfile = wrap(async (req, res) => {
  const userIdx = req.accountIdx;
  const historyResult = await pool.query(selectHistory, [userIdx]);
  const result = historyResult.rows;
  console.log(result);
  res.status(200).send({
    result
  });
});

export const deleteProfile = wrap(async (req, res) => {
  const imgIdx = req.body.img_idx;
  const userIdx = req.accountIdx;

  const results = await pool.query(beforeDeleteImg, [imgIdx, userIdx]);
  if (results.rows.length == 0) {
    throw new ForbiddenError('해당 프로필 이미지의 소유자가 아님.');
  }

  const deleteResult = await pool.query(deleteImg, [imgIdx, userIdx]);
  res.status(200).send({});
});

export const getRoadsLikeList = wrap(async (req, res) => {
  // 회원이 좋아요 한 리스트 출력
  const userIdx = req.accountIdx;
  const page = req.body.page;
  const roadLike = await pool.query(selectUserRoad, [userIdx, page]);
  const result = roadLike.rows;
  res.status(200).send({
    result
  });
});
export const getCentersLikeList = wrap(async (req, res) => {
  //회원이 좋아요 한 리스트 출력
  const userIdx = req.accountIdx;
  const page = req.body.page;
  const centerLike = await pool.query(selectUserCenter, [userIdx, page]);
  const result = centerLike.rows;

  res.status(200).send({
    result
  });
});
