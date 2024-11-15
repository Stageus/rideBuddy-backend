import { Router } from 'express';
const router = Router();
import userAuth from './controller/userAuth.controller';
import userMail from './controller/userMail.controller';
import userProfile from './controller/userProfile.controller';

router.use('/login', userAuth);
router.use('/mail', userMail);
router.use('/', userProfile);

export { router };

// 어떤api가 있냐
// 어떤 미들웨어를 거칠거냐
// 명세서 역할

// route
// api body에 비즈니스 로직밖에 없을것 같다고 생각하면
//controller
//진짜 db에 관련된것들은 service
// api 한개당 컨트롤러 한개 -> 이령/태준 추가로 계층 나눌필요 없어
// controller 빼고 service.
// repo 할지말지 결정해보기

// github 충돌 내보기
// 모듈은 모듈쪽으로 빼 -> passport, 토큰 빼듯이
// router service repo -> 이렇게 하기 .
// 컨트롤러 
// controller 에는 모듈적인 것 넣는거고 원래 데이터베이스와 통신하는 것는 service

// git flow

// 하루에 api 한두개만 끝내자 주말에 세네개 정도
// 근데 토큰이 왜 필요해?

//
