export const push20 = (page, result) => {
  let resultData = [];
  for (let i = 0; i < 20; i++) {
    let startPoint = 20 * (page - 1);
    resultData.push(result[startPoint + i]);
  }
  return resultData;
};

export const isNull = (value) => value == null;
