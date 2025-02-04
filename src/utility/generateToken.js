import 'dotenv/config';
import jwt from 'jsonwebtoken';

const accessSecretKey = process.env.JWT_ACCESSTOKEN_SECRET;
const mailSecretKey = process.env.JWT_MAIL_SECRET;

export const genAccessToken = (account_idx) => {
  const accessToken = jwt.sign(
    {
      accountIdx: account_idx
    },
    accessSecretKey,
    {
      expiresIn: '24h'
    }
  );
  return accessToken;
};

export const genMailToken = (userInfo) => {
  const mailToken = jwt.sign(userInfo, mailSecretKey, {
    expiresIn: '3m'
  });
  return mailToken;
};

// 객체 넘기는걸로 생각해보기 현재는 스트링 넘겨줌.
