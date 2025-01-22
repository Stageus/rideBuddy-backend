import 'dotenv/config';
import jwt from 'jsonwebtoken';

function PromiseJwtVeriy(token, secretKey) {
  return new Promise((resolve, reject) => {
    console.log('token', token);
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
      console.log('decoded', decoded);
    });
  });
}

//** 여기 너무 복잡함.  */
// 서로 상관이 없어야하는게 추상화
//jwt를 검증하는 로직
export const verifyJWT = async (tokenType, token) => {
  const secretKeys = {
    access: process.env.JWT_ACCESSTOKEN_SECRET,
    mail: process.env.JWT_MAIL_SECRET
  };

  const secretKey = secretKeys[tokenType];
  console.log('secretIKey', secretKey);
  try {
    const result = await PromiseJwtVeriy(token, secretKey);
    // result 안에 accountIdx가 있으면 result.accountIdx (loginToken일 경우)
    // result 안에 mail 있으면 result.mail (mailToken일 경우)
    console.log('result', result);
    if (result.accountIdx) {
      return {
        errName: null,
        decoded: result.accountIdx
      };
    } else if (result.mail) {
      return {
        errName: null,
        decoded: result.mail
      };
    }
  } catch (err) {
    return {
      errName: err.name,
      decoded: undefined,
      err: err
    };
  }
};
