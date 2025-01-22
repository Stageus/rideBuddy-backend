import smtpTransport from '#config/email.js';
import pool from '#config/postgresql.js';
import { genMailToken } from '#utility/generateToken.js';
import { insertMailToken } from '../repository.js';

const sendMailUtil = (number, mail, res) => {
  const mailOptions = {
    from: process.env.MAIL_ID + '@naver.com',
    to: mail,
    subject: '인증 관련 메일 입니다.',
    html: '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + number
  };

  smtpTransport.sendMail(mailOptions, async (err, response) => {
    try {
      // 이메일 전송 중 오류 발생 시
      if (err) {
        console.error('SMTP Error:', err);
        return res.json({ ok: false, msg: err.message || '메일 전송 오류' });
      }

      // 이메일 전송 성공 시 처리
      const token = genMailToken(mail);
      await pool.query(insertMailToken, [token, number, 'FALSE']);

      // 응답 반환
      return res.status(200).send({ mail_token: token });
    } catch (error) {
      // 내부 서버 오류 처리
      console.error('Error:', error);
      return res.status(500).json({ ok: false, msg: 'Internal Server Error' });
    } finally {
      // SMTP 연결 종료
    }
  });
};

export default sendMailUtil;
