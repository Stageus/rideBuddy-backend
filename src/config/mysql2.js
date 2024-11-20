import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: 'localhost', // MariaDB 서버 주소
//   user: 'stageus', // 사용자 이름
//   password: '1234', // 비밀번호
//   database: 'web', // 사용할 데이터베이스 이름
//   port: 3306, // MariaDB 포트 (기본값: 3306)
//   connectionLimit: 10,
// });

const pool = mysql;

export default pool;
