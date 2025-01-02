import 'dotenv/config';
import jwt from 'jsonwebtoken';

//jwt를 검증하는 로직
export const verifyJWT = (tokenType, token) => {
  const secretKeys = {
    access: process.env.JWT_ACCESSTOKEN_SECRET,
    refresh: process.env.JWT_REFRESHTOKEN_SECRET,
    mail: process.env.JWT_MAIL_SECRET,
  };

  const secretKey = secretKeys[tokenType];

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
