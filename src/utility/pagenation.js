export const push20 = (page, result) => {
  let resultData = [];
  for (let i = 0; i < 20; i++) {
    let startPoint = 20 * (page - 1);
    resultData.push(result[startPoint + i]);
  }
  return resultData;
};
// sql -> offset으로 처리하자. 데이터베이스로 관련되어있으면
// sql로 완전히 됨. 특정범위로 주는것도 sql로 가능. sql로 바꾸기.
// 환경변수로 20을 빼놓고 나중에 그 숫잠만 바꿔주면 바로 다 바꿔질수 있음. (유지보수)
export const isNull = (value) => value == null;
