import wrap from '#utility/wrapper.js';
import pool from '#config/postgresql.js';
import { selectLoginType, selectInfoForLocal, selectInfoForOAuth, selectProfile } from './repository.js';
export const getMyInfo = wrap(async (req, res) => {
  //1.  req.accountIdx통해.. 로컬 로그인이면
  const userIdx = req.accountIdx;
  const result = await pool.query(selectLoginType, [userIdx]);
  const userLoginType = result.rows[0].token_type;
  let infoResult;
  // 기본 정보 불러오기
  if (userLoginType == 'local') {
    infoResult = await pool.query(selectInfoForLocal, [userIdx]);
    // id, mail , name, profile_img
    // 조인
  } else {
    infoResult = await pool.query(selectInfoForOAuth, [userIdx]);
    // name, profile_img
  }
  // 현재 프로필 이미지 불러오기
  const profile = await pool.query(selectProfile, [userIdx]);
  console.log(userLoginType);

  // profile_img는 가장 최 상단의 img를 주면 됨.
  // 이게 아니라 조인을 할 수 잇나?
  //

  //

  // 그럼 회원가입시 기본 이미지 설정해서 테이블에 저장해주어야 겟네.
  // 현재 프로필 이미지라는거 적어줘야하나?
  // 이미지 어떻게 했더라?

  // 현재 프로필 이미지 어떻게 넣지????
  // 일단 어디다가 넣지? -> aws 애다가 넣자
  //
});

// 프로필 사진 업로드
export const uploadProfile = async (req, res) => {
  console.log(req.file);
  res.send();
};
