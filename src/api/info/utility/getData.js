import { selectXp, selectYp, insertAddress, selectCenters, selectRoads } from '../yr/repository.js';
import { calcDistance } from './harversine.js';
import { sortCompare } from './sortCompareFunc.js';
import pool from '#config/postgresql.js';

export const getData = async (page, nx, ny, dataType) => {
  //1. 현재 nx ,ny, 페이지네이션 오면
  let sortedByDistance = [];
  const currentLocation = {
    nx: nx,
    ny: ny
  };
  let results; //db에서 받아온 값 넣는 변수
  let resultObject; // 최종 값 넣기위한 객체
  try {
    if (dataType == 'center') {
      results = await pool.query(selectCenters);
    } else if (dataType == 'road') {
      results = await pool.query(selectRoads);
    }
  } catch (err) {
    return err;
  }

  const list = results.rows;

  // 2. 현재 위치를 기준으로 거리계산하여
  for (let info of list) {
    const destNxNy = {
      nx: info[`line_xp`],
      ny: info[`line_yp`]
    };
    const distance = calcDistance(currentLocation, destNxNy);

    if (dataType == 'center') {
      resultObject = {
        center_idx: info[`${dataType}_idx`],
        center_name: info[`${dataType}_name`],
        center_address: info[`${dataType}_address`],
        distance: distance
      };
    } else if (dataType == 'road') {
      resultObject = {
        road_idx: info[`${dataType}_idx`],
        road_name: info[`${dataType}_name`],
        road_type: info[`${dataType}_type`], // road는 타입이 추가됨.
        road_address: info[`${dataType}_address`],
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
