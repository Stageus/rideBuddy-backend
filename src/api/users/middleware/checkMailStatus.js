import pool from '#config/postgresql.js';
import 'dotenv/config';
import { checkMailToken, checkMailToken_True } from '../tj/repository';
import {
  UnauthorizedError,
  ForbiddenError,
} from '../../../utility/customError';

const checkMailStatus = async (req, res) => {
  //db에 mailToken이 true가 되어있는지 확인하고
  mail_token = req.body.mail_token;
  const checkmail_token = await pool.query(checkMailToken, [mail_token]);
  if (checkResults.rows.length == 0) {
    return UnauthorizedError.send({ message: 'mail_token이 유효하지 않음.' });
  }
  const checkmail_tokenResult = await pool.query(checkMailToken_True, [
    mail_token,
    'True',
  ]);
  if (checkResults.rows.length == 0) {
    return ForbiddenError.send({ message: 'mail_token이 유효하지 않음.' });
  }
  res.status(200);
};

export default checkMailStatus;
