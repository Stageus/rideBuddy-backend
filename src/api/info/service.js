import pool from '#config/postgresql.js';
import wrap from '#utility/wrapper.js';

import { calcDistance } from './utility/harversine.js';
import { sortCompare } from './utility/sortCompareFunc.js';
import { getData } from './utility/getData.js';
import { verifyReq } from './utility/verifyReq.js';

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
  selectCenterLikeNum,
  givePositionRoad,
  givePositionCenter,
  giveInformationRoadDB,
  giveInformationCenterDB
} from './repository.js';

import { BadRequestError, NotFoundError, ForbiddenError } from '#utility/customError.js';
import { push20, isNull } from '#utility/pagenation.js';

export const getCentersList = wrap(async (req, res) => {
  // 1. 현재 nx ,ny, 페이지네이션 오면
  const { page, nx, ny } = req.body;
  // 유효성 검증 // 지워라
  verifyReq(page, nx, ny);

  const resultData = await getData(page, nx, ny, 'center');
  // 중간에 에러가 났으면 에러 메시지 반환됨
  // 여기 왜 굳이 message가있음? 고치기
  // getData안에서 처리할 수도 있음. 에러처리가 너무 허술함.
  // 에러가 어디로 가는지 통일을 해줘야 함.
  // 여기 점검
  if (resultData.message) {
    throw Error('getData내부에러');
  }
  // 만약 모든 resultData의 모든 값이 Null 일 경우 (더 이상 페이지가 존재하지 않을경우)
  // offset 쓰면 알아서
  // 프론트에서는 그거 두개를 구분하지 않음.
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
  verifyReq(page, nx, ny); //

  const resultData = await getData(page, nx, ny, 'road');
  // 중간에 에러가 났으면 에러 메시지 반환됨
  if (resultData.message) {
    throw Error('getData내부에러');
  }
  // 만약 모든 resultData의 모든 값이 Null 일 경우 (더 이상 페이지가 존재하지 않을경우)
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
  // sql로 짜보자.

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
  const resultData = push20(page, sortedtData);

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

export const getPin = wrap(async (req, res) => {
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
    if (sw.lat < elem.line_yp && ne.lat > elem.line_yp && sw.lng < elem.line_xp && ne.lng > elem.line_xp) {
      result.push(elem);
    }
  }
  for (let elem of roadList) {
    if (sw.lat < elem.line_yp && ne.lat > elem.line_yp && sw.lng < elem.line_xp && ne.lng > elem.line_xp) {
      result.push(elem);
    }
  }

  res.status(200).send({
    result
  });
});

export const giveInformationRoad = wrap(async (req, res, next) => {
  const roadIdx = req.params['roadIdx'];
  const roadResults = await pool.query(giveInformationRoadDB, [roadIdx]);
  if (roadResults.rows.length == 0) {
    return next(new NotFoundError('roadIdx가 유효하지 않음.'));
  }
  res.status(200).json({
    roads_lat_lng: [roadResults.rows[0].road_line_xp, roadResults.rows[0].road_line_yp],
    roads_idx: roadIdx,
    roads_name: roadResults.rows[0].road_name,
    roads_address: roadResults.rows[0].road_address,
    road_likeCount: roadResults.rows[0].road_like
  });
});

export const giveInformationCenter = wrap(async (req, res, next) => {
  const centerIdx = req.params['centerIdx'];
  const centerResults = await pool.query(giveInformationCenterDB, [centerIdx]);
  if (centerResults.rows.length == 0) {
    return next(new NotFoundError('centerIdx가 유효하지 않음.'));
  }
  res.status(200).json({
    centers_lat_lng: [centerResults.rows[0].center_line_xp, centerResults.rows[0].center_line_yp],
    centers_idx: centerIdx,
    centers_name: centerResults.rows[0].center_name,
    centers_address: centerResults.rows[0].center_address,
    center_likeCount: centerResults.rows[0].center_like
  });
});

export const search = wrap(async (req, res, next) => {
  const search = req.body.search;
  if (search.length <= 1) {
    return next(new BadRequestError('검색어는 2글자 이상이어야 합니다.'));
  }

  const RoadResults = await pool.query(searchRoad, [`%${search}%`]);
  const centerResults = await pool.query(searchCenter, [`%${search}%`]);
  const Data = {};

  var centerCount = centerResults.rows.length;
  var roadCount = RoadResults.rows.length;

  if (centerCount <= 20) {
    for (let i = 0; i < centerCount; i++) {
      Data[i + 1] = centerResults.rows[i].center_name;
    }
    for (let i = 0; i < 20 - centerCount && i < roadCount; i++) {
      Data[i + centerCount + 1] = RoadResults.rows[i].road_name;
    }
  } else {
    for (let i = 0; i < 20; i++) {
      Data[i + 1] = centerResults.rows[i].center_name;
    }
  }

  res.status(200).json({ Data: Data });
});

export const position = wrap(async (req, res, next) => {
  const roadIdx = req.body.roadIdx;
  const centerIdx = req.body.centerIdx;
  if (roadIdx) {
    const checkResults = await pool.query(givePositionRoad, [roadIdx]);
    if (checkResults.rows.length == 0) {
      return next(new NotFoundError('roadIdx가 유효하지 않음.'));
    }
    res.status(200).json({
      location: {
        nx: checkResults.rows[0].road_line_xp,
        ny: checkResults.rows[0].road_line_yp
      }
    });
  } else if (centerIdx) {
    const checkResults = await pool.query(givePositionCenter, [centerIdx]);
    if (checkResults.rows.length == 0) {
      return next(new NotFoundError('centerIdx가 유효하지 않음.'));
    }
    res.status(200).json({
      location: {
        nx: checkResults.rows[0].center_line_xp,
        ny: checkResults.rows[0].center_line_yp
      }
    });
  }
});
