import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '#utility/customError.js';

export const verifyJWT = (tokenType, token) => {
  const secretKeys = {
    access: process.env.JWT_ACCESSTOKEN_SECRET,
    mail: process.env.JWT_MAIL_SECRET
  };

  const secretKey = secretKeys[tokenType];
  try {
    const result = jwt.verify(token, secretKey);
    return result;
  } catch (err) {
    if (tokenType == 'mail') {
      throw new UnauthorizedError('mail_token이 유효하지 않음.');
    } else {
      throw new UnauthorizedError('올바른 access token이 아님');
    }
  }
};
