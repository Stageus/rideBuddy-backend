import pool from '#config/postgresql.js';
import 'dotenv/config';
import { checkMailToken, checkMailToken_True } from '../tj/repository.js';
import {
  UnauthorizedError,
  ForbiddenError,
} from '../../../utility/customError.js';

const checkMailStatus = async (req, res, next) => {
  //db에 mailToken이 true가 되어있는지 확인하고
  const mail_token = req.body.mail_token;
  console.log(mail_token);
  const checkmail_token = await pool.query(checkMailToken, [mail_token]);
  if (checkmail_token.rows.length == 0) {
    return next(new UnauthorizedError('mail_token이 유효하지 않음.'));
  }
  const checkmail_tokenResult = await pool.query(checkMailToken_True, [
    mail_token,
    'True',
  ]);
  if (checkmail_tokenResult.rows.length == 0) {
    return next(new ForbiddenError('mail_token이 유효하지 않음.'));
  }
  next();
};

export default checkMailStatus;
