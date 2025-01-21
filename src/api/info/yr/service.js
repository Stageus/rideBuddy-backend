import pool from '#config/postgresql.js';
import {
  selectCenters,
  selectRoads,
  searchCenter,
  searchRoad,
  insertAccountRoadLike,
  selectAccountRoadLike,
  deleteAccountRoadLike,
  plusRoadLikeNum,
  minusRoadLikeNum,
  selectRoadLikeNum,
  selectRoadName,
  selectCenterIdx,
  selectAccountCenterLike,
  insertAccountCenterLike,
  plusCenterLikeNum,
  deleteAccountCenterLike,
  minusCenterLikeNum,
  selectCenterLikeNum
} from './repository.js';
import { calcDistance } from '../utility/harversine.js';
import { sortCompare } from '../utility/sortCompareFunc.js';
import { getData } from '../utility/getData.js';
import wrap from '#utility/wrapper.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '#utility/customError.js';
import { verifyReq } from '../utility/verifyReq.js';
export const getCentersList = wrap(async (req, res) => {
  // 1. 현재 nx ,ny, 페이지네이션 오면
  const { page, nx, ny } = req.body;
  // 유효성 검증
  verifyReq(page, nx, ny);

  const resultData = await getData(page, nx, ny, 'center');
  // 중간에 에러가 났으면 에러 메시지 반환됨
  if (resultData.message) {
    throw Error('getData내부에러');
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

export const getRoadsList = wrap(async (req, res) => {
  // 1. 현재 nx ,ny, 페이지네이션 오면
  const { page, nx, ny } = req.body;
  verifyReq(page, nx, ny);

  const resultData = await getData(page, nx, ny, 'road');
  // 중간에 에러가 났으면 에러 메시지 반환됨
  if (resultData.message) {
    throw Error('getData내부에러');
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

export const searchEnter = wrap(async (req, res) => {
  const { search, page, nx, ny } = req.body;
  verifyReq(page, nx, ny);
  // 1. search LIKE 기준으로 select 한다.
  const centerList = await pool.query(searchCenter, [`%${search}%`]);
  const roadList = await pool.query(searchRoad, [`%${search}%`]);
  let sortedtData = [];
  let resultObject;
  let placeLocation;
  // 현재 위치
  const currentLocation = {
    nx: nx,
    ny: ny
  };
  // 2. 현재위치기준 인증센터와 자전거길 거리 구해서 push
  for (let list of centerList.rows) {
    placeLocation = {
      nx: list.line_xp,
      ny: list.line_yp
    };
    let distance = calcDistance(currentLocation, placeLocation);
    resultObject = {
      center_idx: list.center_idx,
      center_name: list.center_name,
      center_address: list.center_address,
      distance: distance
    };
    sortedtData.push(resultObject);
  }

  for (let list of roadList.rows) {
    placeLocation = {
      nx: list.line_xp,
      ny: list.line_yp
    };
    let distance = calcDistance(currentLocation, placeLocation);
    resultObject = {
      road_idx: list.road_idx,
      road_name: list.road_name,
      road_type: list.road_type,
      road_address: list.road_address,
      distance: distance
    };
    sortedtData.push(resultObject);
  }
  // 3. 최종적으로 Push 한거 거리순으로 분류
  sortedtData.sort(sortCompare);

  // 4. 20개씩 나눠서 전달
  let resultData = [];
  for (let i = 0; i < 20; i++) {
    let startPoint = 20 * (page - 1);
    resultData.push(sortedtData[startPoint + i]);
  }
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

export const roadLike = wrap(async (req, res) => {
  // 자전거길 좋아요. 자전거길 기준으로 좋아요가 되고.
  // 한번 누르면 좋아요 , 다시한 누르면 좋아요 취소
  const userIdx = req.accountIdx;
  const roadName = req.params['roadName'];
  // roadName param값 안오면 안되고
  if (!roadName) {
    throw new BadRequestError('올바른 req값이 아님.');
  }
  const testRoadName = await pool.query(selectRoadName, [roadName]);
  if (testRoadName.rows.length == 0) {
    throw new NotFoundError('알맞은 param값이 아님');
  }
  // 해당 유저가 해당 길을 좋아요 했는지 여부
  const likeStatus = await pool.query(selectAccountRoadLike, [userIdx, roadName]);

  // 좋아요를 하지 않았으면 좋아요테이블에 추가하고 좋아요수 업데이트
  if (likeStatus.rows.length == 0) {
    await pool.query(insertAccountRoadLike, [userIdx, roadName]);
    await pool.query(plusRoadLikeNum, [roadName]);
  } else {
    // 좋아요 했었으면 좋아요 테이블에서 삭제하고 좋아요수 업데이트
    await pool.query(deleteAccountRoadLike, [userIdx, roadName]);
    await pool.query(minusRoadLikeNum, [roadName]);
  }

  const likeCount = await pool.query(selectRoadLikeNum, [roadName]);
  res.status(200).send({
    'road likeCount': likeCount.rows[0].road_like
  });
});

export const centerLike = async (req, res) => {
  // 센터 좋아요. 센터 기준으로 좋아요가 되고.
  // 한번 누르면 좋아요 , 다시한 누르면 좋아요 취소
  const userIdx = req.accountIdx;
  console.log('userIdx', userIdx);
  const centerIdx = req.params['centerIdx'];
  if (!centerIdx) {
    throw new BadRequestError('올바른 req값이 아님.');
  }
  const testCenterIdx = await pool.query(selectCenterIdx, [centerIdx]);
  if (testCenterIdx.rows.length == 0) {
    throw new NotFoundError('알맞은 param값이 아님');
  }
  // 해당 유저가 해당 센터를 좋아요 했는지 여부
  const likeStatus = await pool.query(selectAccountCenterLike, [userIdx, centerIdx]);

  // 좋아요를 하지 않았으면 좋아요테이블에 추가하고 좋아요수 업데이트
  if (likeStatus.rows.length == 0) {
    await pool.query(insertAccountCenterLike, [userIdx, centerIdx]);
    await pool.query(plusCenterLikeNum, [centerIdx]);
  } else {
    // 좋아요 했었으면 좋아요 테이블에서 삭제하고 좋아요수 업데이트
    await pool.query(deleteAccountCenterLike, [userIdx, centerIdx]);
    await pool.query(minusCenterLikeNum, [centerIdx]);
  }

  const likeCount = await pool.query(selectCenterLikeNum, [centerIdx]);
  res.status(200).send({
    'center likeCount': likeCount.rows[0].center_like
  });
};
export const getPin = async (req, res) => {
  //1. 지도 좌표경계 좌표를 받는다.
  const { sw, ne } = req.body;
  if (!sw || !ne) {
    throw new BadRequestError('올바른 req값이 아님');
  }

  let centerList = await pool.query(selectCenters);
  let roadList = await pool.query(selectRoads);
  centerList = centerList.rows;
  roadList = roadList.rows;
  //2. 지도좌표 범위에 맞는 center와 road선별해서 push
  let result = [];
  for (let elem of centerList) {
    if (sw.lat < elem.line_yp && ne.lat > elem.line_yp) {
      result.push(elem);
    }
  }
  for (let elem of roadList) {
    if (sw.lng < elem.line_xp && ne.lng > elem.line_xp) {
      result.push(elem);
    }
  }

  res.status(200).send({
    result
  });
};
