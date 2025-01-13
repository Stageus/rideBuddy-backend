// import { S3Client } from '@aws-sdk/client-s3';
// import multerS3 from 'multer-s3';
// import multer from 'multer';
// import { v4 as uuidv4 } from 'uuid';
// import 'dotenv/config';
// import { BadRequestError } from '#utility/customError.js';

// const s3 = new S3Client({
//   region: 'ap-northeast-2',
//   credentials: {
//     secretAccessKey: process.env.S3_SECRET_KEY,
//     accessKeyId: process.env.S3_ACCESS_KEY
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const fileType = file.mimetype.split('/')[1];
//   const tureType = ['jpg', 'png', 'jpeg', 'gif', 'webp'];
//   for (let type of tureType) {
//     if (fileType == type) {
//       return cb(null, true);
//     }
//   }
//   return cb(new BadRequestError('잘못된 확장자입니다'), false);
// };

// export const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.BUCKET_NAME,
//     acl: 'public-read',
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: function (req, file, cb) {
//       let uuid = uuidv4();
//       cb(null, `id=${req.accountIdx}_${uuid}`);
//     }
//   }),
//   limits: { fileSize: 10 * 1024 * 1024 },
//   fileFilter: fileFilter
// });
