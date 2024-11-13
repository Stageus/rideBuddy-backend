import { Router } from 'express';
const router = Router();
import { userNaverLogin, userNaverToken } from '../service/userAuth.service';

router.post('/local');

router.post('/naver', userNaverLogin);
router.get('/naver/callback', userNaverToken);

router.post('/google');

export { router };
