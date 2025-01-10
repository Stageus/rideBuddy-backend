import express from 'express';
// import weather from
const router = express.Router();
import weather from './service.js';

router.get('/', weather);

export default router;
