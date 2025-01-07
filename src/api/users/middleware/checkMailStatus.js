import pool from '#config/postgresql.js';
import 'dotenv/config';
import { checkMailToken, checkMailToken_True } from '../tj/repository.js';
import { UnauthorizedError, ForbiddenError } from '../../../utility/customError.js';
import wrap from '#utility/wrapper.js';

//db에 mailToken이 true가 되어있는지 확인하는.. 코드인데 왜 true로 바꾸는 코드가 여기에 있지?
const checkMailStatus = wrap(async (req, res, next) => {
  const mail_token = req.body.mail_token;

  const checkmail_token = await pool.query(checkMailToken, [mail_token]);
  if (checkmail_token.rows.length == 0) {
    return next(new UnauthorizedError('mail_token이 유효하지 않음.'));
  }

  const checkmail_tokenResult = await pool.query(checkMailToken_True, [mail_token, 'True']);
  if (checkmail_tokenResult.rows.length == 0) {
    return next(new ForbiddenError('mail_token이 유효하지 않음.'));
  }
  next();
});

export default checkMailStatus;
