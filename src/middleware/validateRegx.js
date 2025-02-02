import wrap from '#utility/wrapper.js';
import { BadRequestError } from '#utility/customError.js';
export const validateRegx = (params) => {
  return wrap(async (req, res, next) => {
    for (let param of params) {
      let key = param[0];
      let regx = param[1];
      let value = [];
      let regxResult;

      if (req.body.sw) {
        // /info/pin 일때만 동작
        value.push(req.body.sw[key]);
        value.push(req.body.ne[key]);
      } else {
        // 그외 api 일때 동작
        value.push(req.body[key] || req.query[key] || req.params[key]);
      }

      value.forEach((elem) => {
        regxResult = elem === undefined ? regxResult === false : regx.test(elem);
        if (!regxResult) {
          throw new BadRequestError(`${key}에서 정규표현식 에러`);
        }
      });
    }
    next();
  });
};
