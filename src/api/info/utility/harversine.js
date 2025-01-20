export const calcDistance = (curObj, destObj) => {
  const currX = curObj['nx']; // 출발지 경도
  const currY = curObj['ny']; // 출발지 위도
  const destX = destObj['nx']; // 목적지 경도
  const destY = destObj['ny']; // 목적지 위도

  const radius = 6371; // 지구 반지름(km)
  const toRadian = Math.PI / 180; // 도를 라디안으로 바꾸기

  const deltaLat = Math.abs(currX - destX) * toRadian; //라디안 값으로 변경
  const deltaLng = Math.abs(currY - destY) * toRadian; // 라디안 값으로 변경

  const squareSinDeltLat = Math.pow(Math.sin(deltaLat / 2), 2); // 사인값 제곱
  const squareSinDeltLng = Math.pow(Math.sin(deltaLng / 2), 2); // 사인값 제곱

  // 하버사인공식 1
  const squareRoot = Math.sqrt(
    squareSinDeltLat + Math.cos(currX * toRadian) * Math.cos(destX * toRadian) * squareSinDeltLng
  );
  // 하버사인공식 2 결과
  const result = 2 * radius * Math.asin(squareRoot);
  return result;
};
