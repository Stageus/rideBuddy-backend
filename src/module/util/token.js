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

//
export const verifyResult = (tokenType, token) => {
  let secretKey;
  if (tokenType === 'access') {
    secretKey = process.env.JWT_ACCESSTOKEN_SECRET;
  } else {
    secretKey = process.env.JWT_REFRESHTOKEN_SECRET;
  }

  let result = {
    errMessage: '',
    decoded: '',
  };

  // token이 없어서 그런가?
  jwt.verify(token, secretKey, function (err, decoded) {
    //
    if (err) {
      result.errMessage = err.message;
      console.log('에러메시지', result.errMessage);
      result.decoded = decoded; //undefined
      return result;
      // if (err.message === 'jwt expired') {
      //   result.errMessage = err.message;
      //   result.decoded = decoded; //undefined
      //   return result;
      // } else {
      // }
    } else {
      result.errMessage = null;
      result.decoded = decoded;
      return result;
    }
  });
};
