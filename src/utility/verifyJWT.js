import 'dotenv/config';
import jwt from 'jsonwebtoken';

function PromiseJwtVeriy(token, secretKey) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
}

//jwt를 검증하는 로직
export const verifyJWT = async (tokenType, token) => {
  const secretKeys = {
    access: process.env.JWT_ACCESSTOKEN_SECRET,
    mail: process.env.JWT_MAIL_SECRET,
  };

  const secretKey = secretKeys[tokenType];

  try {
    const result = await PromiseJwtVeriy(token, secretKey);
    return {
      errName: null,
      decoded: result.accountIdx,
    };
  } catch (err) {
    return {
      errName: err.name,
      decoded: undefined,
      err: err,
    };
  }
};
