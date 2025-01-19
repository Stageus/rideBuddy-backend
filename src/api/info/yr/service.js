import pool from '#config/postgresql.js';
import axios from 'axios';
import { selectXp, selectYp, insertAddress, selectCenter } from './repository.js';
import { calcDistance } from '../utility/harversine.js';
import { sortCompare } from '../utility/sortCompareFunc.js';
export const getCentersList = async (req, res) => {
  // 1. 현재 nx ,ny, 페이지네이션 오면
  const { page, nx, ny } = req.body;
  let sortedByDistance = [];
  const currentLocation = {
    nx: nx,
    ny: ny
  };
  const results = await pool.query(selectCenter);
  const centerList = results.rows;

  // 2. 현재 위치를 기준으로 거리계산하여
  for (let centerInfo of centerList) {
    const destNxNy = {
      nx: centerInfo.center_line_xp,
      ny: centerInfo.center_line_yp
    };
    const distance = calcDistance(currentLocation, destNxNy);
    const resultObject = {
      center_idx: centerInfo.center_idx,
      center_name: centerInfo.center_name,
      center_address: centerInfo.center_address,
      distance: distance
    };
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
  res.status(200).send({
    resultData
  });
};

export const getRoadsList = async (req, res) => {
  // 시작점과 끝점?
  // 시작점과 끝점이.. 필요한가? 그럼 좋아요가 문제가 되는데
  // 이건 천천히 가면서 새악해봐야겠다.
};
