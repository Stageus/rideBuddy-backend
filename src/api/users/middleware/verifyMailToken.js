import 'dotenv/config';
import jwt from 'jsonwebtoken';

// 5분내에 인증을 원하는 개인인지 확인필요
// 아직 안함

//jwt를 검증하는 로직 , 밑에 함수에서 필요
const verifyJWT = (token) => {
  const secretKey = process.env.JWT_MAIL_SECRET;

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

// 토큰이 유효한지 체크
export const verifyMailToken = async (req, res, next) => {
  // wrapper 필요 mail_token으로 안올시 에러남
  const mailToken = req.body['mail_token'];

  const mailResult = verifyJWT(mailToken);

  //토큰 만료가 아닌 다른에러라면
  const errorName = ['JsonWebTokenError', 'NotBeforeError'];
  for (const error of errorName) {
    if (mailResult.errName === error) next(mailResult.err);
  }

  //1. 만료되었다면 만료되었다고
  if (mailResult.errName == 'TokenExpiredError') {
    next(new Error('토큰이 만료되었음.'));
  }
  //2. 검증성공시
  else {
    next();
  }
};
