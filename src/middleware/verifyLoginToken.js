import 'dotenv/config';
import { verifyJWT } from '#utility/verifyJWT.js';
import wrap from '#utility/wrapper.js';
// 토큰이 유효한지 체크 ,로컬 액세스 토큰 만료시 갱신후 반환
export const verifyLoginToken = wrap(async (req, res, next) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  const accessResult = verifyJWT('access', accessToken);
  req.accountIdx = accessResult.accountIdx;
  next();
});
