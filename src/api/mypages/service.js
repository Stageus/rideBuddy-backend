import wrap from '#utility/wrapper.js';
export const getMyInfo = wrap(async (req, res) => {
  // req.accountIdx를 통해 로컬로그인이라면 id, mail, name, profile_img를 준다.
  // 만약 naver나 google 로그인이라면 name, profile_img를 준다.
  // 기본 프로필 이미지는 db에 저장해야하나?
  // 그럼 회원가입시 기본 이미지 설정해서 테이블에 저장해주어야 겟네.
  // 현재 프로필 이미지라는거 적어줘야하나?
  // 이미지 어떻게 했더라?
  //
});
