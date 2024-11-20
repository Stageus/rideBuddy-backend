import 'dotenv/config';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // 비밀번호 암호화를 위한 라이브러리
import pool from '../../../config/mysql2.js'; // MariaDB 연결 설정

// Google OAuth 인증 시작
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Google OAuth 콜백 처리
export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: 'Authentication failed' });

    // JWT 생성
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 클라이언트에 JWT 반환
    res.json({ message: 'Authentication successful', token });
  })(req, res, next);
};

export const register = async (req, res, next) => {
  try {
    // 1. 요청 본문(body)에서 데이터 추출

    const { id, account_name, tell, pw, mail } = req.body;

    // 2. 입력값 검증
    if (!id || !pw || !account_name || !mail) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }
    const [existingUsers] = await pool.execute(
      'SELECT id, mail FROM account WHERE id = ? OR mail = ?',
      [id, mail]
    );

    if (existingUsers.length > 0) {
      const isDuplicateId = existingUsers.some((user) => user.id === id);
      const isDuplicateMail = existingUsers.some((user) => user.mail === mail);

      if (isDuplicateId && isDuplicateMail) {
        return res.status(409).json({ error: '중복된 아이디와 이메일입니다.' });
      } else if (isDuplicateId) {
        return res.status(409).json({ error: '중복된 아이디입니다.' });
      } else if (isDuplicateMail) {
        return res.status(409).json({ error: '중복된 이메일입니다.' });
      }
    }

    // 3. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(pw, 10);

    // 4. 데이터베이스에 사용자 저장
    const sql = `
      INSERT INTO account (id, account_name ,tell, pw, mail) 
      VALUES (?, ?, ?, ?,?)
    `;
    await pool.execute(sql, [id, account_name, tell, hashedPassword, mail]);

    // 5. 성공 응답
    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error('회원가입 중 오류 발생:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: '중복된 아이디 또는 이메일입니다.' });
    } else {
      res.status(500).json({ error: '회원가입에 실패했습니다.' });
    }
  }
};

export const duplicate_id = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: '아이디를 입력해주세요.' });
    }
    const [existingUsers] = await pool.execute(
      'SELECT id FROM account WHERE id = ?',
      [id]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: '이미 사용중인 id' });
    } else {
      return res.status(200);
    }
  } catch (error) {
    res.status(500);
  }
};

export const duplicate_tell = async (req, res, next) => {
  try {
    const { tell } = req.body;

    // 1. 입력값 검증
    if (!tell) {
      return res.status(400).json({ error: '전화번호를 입력해주세요.' });
    }

    // 2. 데이터베이스에서 전화번호 중복 확인
    const [existingUsers] = await pool.execute(
      'SELECT tell FROM account WHERE tell = ?',
      [tell]
    );

    // 3. 중복 확인 결과 처리
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: '이미 사용중인 전화번호입니다.' });
    } else {
      return res.status(200);
    }
  } catch (error) {
    console.error('전화번호 중복 확인 중 오류 발생:', error);
    return res.status(500);
  }
};
