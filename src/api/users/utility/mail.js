import smtpTransport from '#config/email.js';
import { pool, client } from '#config/postgresql.js';
import { genMailToken } from '#utility/generateToken.js';
import { insertMailToken } from '../repository.js';
import wrap from '#utility/wrapper.js';

const sendMailUtil = wrap(async (number, mail, res) => {
  const mailOptions = {
    from: process.env.MAIL_ID + '@naver.com',
    to: mail,
    subject: '인증 관련 메일 입니다.',
    html: '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + number
  };
  smtpTransport.sendMail(mailOptions);
  const token = genMailToken(mail);
  await pool.query(insertMailToken, [token, number, 'FALSE']);
  res.status(200).send({ mail_token: token });
});

export default sendMailUtil;
