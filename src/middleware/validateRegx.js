import wrap from '#utility/wrapper.js';
import { BadRequestError } from '#utility/customError.js';
export const validateRegx = (params) => {
  return wrap(async (req, res, next) => {
    for (let param of params) {
      let key = param[0];
      let regx = param[1];
      let value = req.body[key] || req.query[key] || req.params[key];
      // 안왔다고 해도 여기에 로직이 있는게 맞다.
      // undefined 나 null도 정규표현식에도 거를 수 있음.
      const result = regx.test(value);
      if (!result) {
        throw new BadRequestError('정규표현식 에러'); //어떤키에서 에러났는지 키 이름을 넣어주자.
        // 프론트엔드 친절하게 주려고 주는거니까 id 정규표현식 에러 이런식으로 에러 주기.
        // wrap 만든흐름 보면서 throw로 바꿀꺼 바꾸기
      }
    }
    next();
  });
};
