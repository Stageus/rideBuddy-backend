import { selectXp, selectYp, insertAddress, selectCenters, selectRoads } from '../yr/repository.js';
import { calcDistance } from './harversine.js';
import { sortCompare } from './sortCompareFunc.js';
// import pool from '#config/postgresql.js';

export const getData = async (page, nx, ny, type) => {
  //1. 현재 nx ,ny, 페이지네이션 오면
  let sortedByDistance = [];
  const currentLocation = {
    nx: nx,
    ny: ny
  };
  let results; //db에서 받아온 값 넣는 변수
  let resultObject; // 최종 값 넣기위한 객체
  try {
    if (type == 'center') {
      results = await pool.query(selectCenters);
    } else if (type == 'road') {
      results = await pool.query(selectRoads);
    }
  } catch (err) {
    return err;
  }

  const list = results.rows;

  // 2. 현재 위치를 기준으로 거리계산하여
  for (let info of list) {
    const destNxNy = {
      nx: info[`${type}_line_xp`],
      ny: info[`${type}_line_yp`]
    };
    const distance = calcDistance(currentLocation, destNxNy);

    if (type == 'center') {
      resultObject = {
        center_idx: info[`${type}_idx`],
        center_name: info[`${type}_name`],
        center_address: info[`${type}_address`],
        distance: distance
      };
    } else {
      resultObject = {
        road_idx: info[`${type}_idx`],
        road_name: info[`${type}_name`],
        road_type: info[`${type}_type`], // road는 타입이 추가됨.
        road_address: info[`${type}_address`],
        distance: distance
      };
    }

    sortedByDistance.push(resultObject);
  }
  // 3. 거리순으로 정렬한다.
  sortedByDistance.sort(sortCompare);

  let resultData = [];
  // 4. 페이지네이션에 맞춰서 20개씩 보내준다.
  for (let i = 0; i < 20; i++) {
    let startPoint = 20 * (page - 1);
    resultData.push(sortedByDistance[startPoint + i]);
  }
  return resultData;
};
