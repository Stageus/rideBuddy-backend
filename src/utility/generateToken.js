import 'dotenv/config';
import jwt from 'jsonwebtoken';

const accessSecretKey = process.env.JWT_ACCESSTOKEN_SECRET;
const refreshSecretKey = process.env.JWT_REFRESHTOKEN_SECRET;
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

export const genMailToken = (mail) => {
  const mailToken = jwt.sign(
    {
      mail: mail
    },
    mailSecretKey,
    {
      expiresIn: '3m'
    }
  );
  return mailToken;
};
