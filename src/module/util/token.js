import 'dotenv/config';
import jwt from 'jsonwebtoken';

const accessSecretKey = process.env.JWT_ACCESSTOKEN_SECRET;
const refreshSecretKey = process.env.JWT_REFRESHTOKEN_SECRET;

export const genAccessToken = (account_idx) => {
  const accessToken = jwt.sign(
    {
      accountIdx: account_idx,
    },
    accessSecretKey,
    {
      expiresIn: '30s',
    }
  );
  return accessToken;
};

export const genRefreshToken = (account_idx) => {
  const refreshToken = jwt.sign(
    {
      accountIdx: account_idx,
    },
    refreshSecretKey,
    {
      expiresIn: '7d',
    }
  );
  return refreshToken;
};

export const verifyAccess = (token) => {
  const accessSecretKey = process.env.JWT_ACCESSTOKEN_SECRET;
  let result = {
    errMessage: '',
    decoded: '',
  };
  jwt.verify(token, accessSecretKey, function (err, decoded) {
    if (err) {
      result.errMessage = err.message;
      result.decoded = decoded; //undefined
      return result;
    } else {
      result.errMessage = null;
      result.decoded = decoded;
      return result;
    }
  });
};

export const verifyRefresh = (token) => {
  const refreshSecretKey = process.env.JWT_REFRESHTOKEN_SECRET;
  let result = {
    errMessage: '',
    decoded: '',
  };
  jwt.verify(token, refreshSecretKey, function (err, decoded) {
    if (err) {
      result.errMessage = err.message;
      result.decoded = decoded; //undefined
      return result;
    } else {
      result.errMessage = null;
      result.decoded = decoded;
      return result;
    }
  });
};

// local 액세스 토큰만료시 갱신 후 반환
// 로직이 어떻게 됐더라
//

// 리프레이쉬 토큰 만료시
