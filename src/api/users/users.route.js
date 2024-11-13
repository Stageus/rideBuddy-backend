import { Router } from 'express';
const router = Router();
import userAuth from './controller/userAuth.controller';
import userMail from './controller/userMail.controller';
import userProfile from './controller/userProfile.controller';

router.use('/login', userAuth);
router.use('/mail', userMail);
router.use('/', userProfile);

export { router };
