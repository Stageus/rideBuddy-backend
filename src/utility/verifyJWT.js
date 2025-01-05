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
      // return 하고 여기서 오브젝트로 보내 .
      // 기초지식이 없어서 느린것같음.
      // 심화단계 끝낙고 기준으로는 느림.
      // 아...
      // 협프 했던 기준으로 느리다.
      // 이해가 안된채로 넘어간게 문제였음.
      //
    } else {
      result.errName = null;
      result.decoded = decoded;
    }
  });
  return result;
};
