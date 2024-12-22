import { idRegx, pwRegx, nameRegx, mailRegx, codeRegx } from '#config/regx.js';

export const checkRegx = async (req, res, next) => {
  //req body로만 줌.

  //console.log(Object.keys(req.body).length);
  //console.log(Object.keys(req.body));

  //length 만큼 반복,, 아님 키만큼 반복해도 되는거 아냐?
  //for ..of?
  //해당 키 값에 Regx 더하기.
  //이게 가능한가?

  //
  //console.log(Object.keys(req.body)[0]);
  let regx = Object.keys(req.body)[0] + 'Regx';

  let value = 'id가되나';
  let func = new Function(`${regx}.test(${value})`);
  console.log(func());
  res.send();
};
