import nodemailer from 'nodemailer';

const smtpTransport = nodemailer.createTransport({
  pool: true,
  maxConnections: 3,
  service: 'naver',
  host: 'smpt.naver.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PW
  },
  tls: {
    rejectUnauthorized: false
  }
});

export default smtpTransport;
