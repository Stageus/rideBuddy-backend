import wrap from '#utility/wrapper.js';
import { BadRequestError } from '#utility/customError.js';
export const validateRegx = (params) => {
  return wrap(async (req, res, next) => {
    for (let param of params) {
      console.log('param이 어떻게 오지?', param);
      let key = param[0];
      let regx = param[1];
      let value = req.body[key] || req.query[key] || req.params[key];
      // getPin일 경우만 해당됨
      if (!value) {
        value = req.body.sw[key];
        if (!value) {
          value = req.body.ne[key];
        }
      }
      const result = regx.test(value);
      if (!result) {
        throw new BadRequestError(`${key}에서 정규표현식 에러`);
      }
    }
    next();
  });
};
