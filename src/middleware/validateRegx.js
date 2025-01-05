import { idRegx, pwRegx, nameRegx, mailRegx, codeRegx } from '#utility/regx.js';

export const validateRegx = async (req, res, next) => {
  // 여기다가 wrapper를 쓰기 그게 중복코드도 더 줄어들고.
  const regx = {
    id: idRegx,
    pw: pwRegx,
    name: nameRegx,
    mail: mailRegx,
    code: codeRegx,
  };
  //mail_token은 제외하기
  console.log('validateRegx 함수 통과중');
  const bodyArray = Object.entries(req.body);

  // 추상화를 잘못했다????
  // 함수분할을 잘 못 했당 = 재사용가능, 의미가 정확하게 전달되어야함
  //

  // 매개변숲로 테스트하고 싶은 키, 정규표현식
  // 이렇게 제외해야할 req내용이 나오면 코드를 추가해야하니까 그것또 유지보수에 문제가 됨.

  //
  const withoutToken = bodyArray.filter((element) => {
    return element[0] !== 'mail_token';
  });
  console.log('regx test', withoutToken);

  //정규식test
  // api는 req .key를 못바꾸니까 regx미들웨어와 일반 api와 종속되어버리니까 (무조건 반대것도 수정되어야하는거.)
  // 매개변수를 받아주는게 오히려 종속성을 더 덜어준다.
  // 바꿔주기
  withoutToken.forEach((elem) => {
    const key = elem[0];
    if (regx[key]) {
      const result = regx[key].test(elem[1]);
      console.log(result);
      if (!result) {
        return next(new Error('정규표현식 에러'));
      }
    } else {
      return next(new Error('유효하지 않은 정규표현식 key값'));
    }
  });
  next();
};
