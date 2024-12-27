import 'dotenv/config';
import jwt from 'jsonwebtoken';

const accessSecretKey = process.env.JWT_ACCESSTOKEN_SECRET;
const refreshSecretKey = process.env.JWT_REFRESHTOKEN_SECRET;
const identSecretKey = process.env.JWT_IDENT_SECRET;

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

export const genMailToken = (mail) => {
  const mailToken = jwt.sign(
    {
      mail: mail,
    },
    identSecretKey,
    {
      expiresIn: '5m',
    }
  );
  return mailToken;
};
