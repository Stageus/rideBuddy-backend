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
  // db에 테이블이 하나라면 시작점과 끝점을 구별해주기해서 주기가 어려움. idx상에도 연관관계가 없기 때문.
  // 일단 데이터 올려놔야겠다 쟤도 할수있게
  // 지도 표시 반경..? 알아야하나?
  // road관련 기능이 일단 getRoadList , 그다음에 /info (엔터쳤을때 검색), 그다음에 좋아요.
  // 내일 center 데이터도 파이썬으로 csv 파일 만들어서 올려놓기.
};

export const searchEnter = async (req, res) => {};
export const roadLike = async (req, res) => {};
export const centerLike = async (req, res) => {};
export const getPin = async (req, res) => {};
