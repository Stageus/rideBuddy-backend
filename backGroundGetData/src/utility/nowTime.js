export const nowTime = () => {
  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const second = new Date().getSeconds();

  const surveyTime = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  return surveyTime;
};
