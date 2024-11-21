import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from './mysql2.js'; // MariaDB 연결

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/users/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 사용자 정보 추출
        const userData = {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          photo: profile.photos[0].value,
        };

        // MariaDB에 사용자 저장
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
          `SELECT * FROM users WHERE google_id = ?`,
          [userData.googleId]
        );

        if (rows.length === 0) {
          // 신규 사용자 추가
          await connection.query(
            `INSERT INTO users (google_id, email, name, photo) VALUES (?, ?, ?, ?)`,
            [userData.googleId, userData.email, userData.name, userData.photo]
          );
        } else {
          console.log('사용자가 이미 존재합니다.');
        }

        connection.release();

        // 사용자 데이터 반환
        return done(null, userData);
      } catch (error) {
        console.error('Database Error:', error);
        return done(error, null);
      }
    }
  )
);

export default passport;
