import pool from '#config/postgresql.js';
import axios from 'axios';
import { selectXp, selectYp, insertAddress, selectCenter } from './repository.js';
import { calcDistance } from '../utility/harversine.js';
import { sortCompare } from '../utility/sortCompareFunc.js';
import wrap from '#utility/wrapper.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '#utility/customError.js';

export const getCentersList = wrap(async (req, res) => {
  // 1. 현재 nx ,ny, 페이지네이션 오면
  const { page, nx, ny } = req.body;
  if (!page || !nx || !ny) {
    throw new BadRequestError('올바른 req값이 아님');
  }
  if (!(nx >= 33 && nx <= 43 && ny >= 124 && ny <= 132)) {
    throw new BadRequestError('올바른 위경도값이 아님');
  }
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
  // 만약 모든 resultData의 모든 값이 Null 일 경우 (더 이상 페이지가 존재하지 않을경우)
  const isNull = (value) => value == null;
  if (resultData.every(isNull)) {
    res.status(200).send({
      message: '더 이상 페이지가 존재하지 않습니다.'
    });
    return;
  }

  res.status(200).send({
    resultData
  });
});

export const getRoadsList = async (req, res) => {
  // 시작점과 끝점?
  // 시작점과 끝점이.. 필요한가? 그럼 좋아요가 문제가 되는데
  // 이건 천천히 가면서 새악해봐야겠다.
};
