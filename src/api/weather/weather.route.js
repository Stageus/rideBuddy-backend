import { Router } from 'express';
const router = Router();
import { weather } from './weather.service.js';

router.get('/', weather);

export default router;
