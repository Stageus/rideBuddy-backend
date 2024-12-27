import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { genAccessToken } from '../api/users/utility/generateToken.js';

//jwt를 검증하는 로직 , 밑에 함수에서 필요
// 이거 수정 필요
const verifyJWT = (tokenType, token) => {
  let secretKey;
  if (tokenType === 'access') {
    secretKey = process.env.JWT_ACCESSTOKEN_SECRET;
  } else {
    secretKey = process.env.JWT_REFRESHTOKEN_SECRET;
  }

  let result = {
    errName: '',
    decoded: '',
  };

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      result.errName = err.name;
      result.decoded = decoded; //undefined
      result.err = err;
    } else {
      result.errName = null;
      result.decoded = decoded;
    }
  });
  return result;
};

// 토큰이 유효한지 체크 ,로컬 액세스 토큰 만료시 갱신후 반환
export const verifyToken = async (req, res, next) => {
  const refreshToken = req.headers.refreshtoken;
  // 여기 프론트와 refreshtoken 어떻게 보내줄건지 상의후 코드 고치기
  const accessToken = req.headers.authorization;

  const accessResult = verifyJWT('access', accessToken);
  const refreshResult = verifyJWT('refresh', refreshToken);

  //토큰 만료가 아닌 다른에러라면
  const errorName = ['JsonWebTokenError', 'NotBeforeError'];
  for (const error of errorName) {
    if (accessResult.errNmae === error) next(accessResult.err);
    if (refreshResult.errName === error) next(refreshResult.err);
  }

  //(1) access token 비만료, -> 갱신할 필요 없음.
  if (accessResult.errName === null) {
    next();
  }
  //(2) access token 만료, refresh token 만료 -> 로그인 다시
  else if (refreshResult.errName === 'TokenExpiredError') {
    next(err); //리프레쉬 토큰 만료라고 보내줘야 할것 같다.
  }
  //(3) access token 만료, refresh token 비만료 -> access token 갱신
  else {
    // 갱신
    // 1. 리프레쉬토큰의 account_idx 얻어서
    const refreshSecretKey = process.env.JWT_REFRESHTOKEN_SECRET;
    const decoded = jwt.verify(refreshToken, refreshSecretKey);
    // 2. 다시 genAccessToken 하면 됨.
    const newAccessToken = genAccessToken(decoded.accountIdx);
    //응답헤더에 accessToken 보내기
    res.set('access_token', newAccessToken);
    next();
  }
};
