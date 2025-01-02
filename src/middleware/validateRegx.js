import { idRegx, pwRegx, nameRegx, mailRegx, codeRegx } from '#utility/regx.js';

export const validateRegx = async (req, res, next) => {
  const regx = {
    id: idRegx,
    pw: pwRegx,
    name: nameRegx,
    mail: mailRegx,
    code: codeRegx,
  };
  //mail_token은 제외하기
  const bodyArray = Object.entries(req.body);
  const withoutToken = bodyArray.filter((element) => {
    return element[0] !== 'mail_token';
  });
  console.log('regx test', withoutToken);
  //정규식test
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
