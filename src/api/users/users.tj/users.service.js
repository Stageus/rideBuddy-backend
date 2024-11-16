import 'dotenv/config';
import passport from 'passport';
import jwt from 'jsonwebtoken';

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
