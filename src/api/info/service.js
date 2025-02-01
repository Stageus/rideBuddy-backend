import { pool } from '#config/postgresql.js';
import wrap from '#utility/wrapper.js';

import {
  CenterByDistance,
  roadByDistance,
  searchData,
  selectPin,
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

import { BadRequestError, NotFoundError } from '#utility/customError.js';

export const getCentersList = wrap(async (req, res) => {
  const { page, longitude, latitude } = req.body;

  const result = await pool.query(CenterByDistance, [page, latitude, longitude]);
  const resultData = result.rows;

  res.status(200).send({
    resultData
  });
});

export const getRoadsList = wrap(async (req, res) => {
  const { page, longitude, latitude } = req.body;

  const result = await pool.query(roadByDistance, [page, latitude, longitude]);
  const resultData = result.rows;

  res.status(200).send({
    resultData
  });
});

export const searchEnter = wrap(async (req, res) => {
  const { search, page, longitude, latitude } = req.body;

  const result = await pool.query(searchData, [`%${search}%`, page, latitude, longitude]);
  const resultData = result.rows;

  res.status(200).send({
    resultData
  });
});

export const roadLike = wrap(async (req, res) => {
  // 자전거길 좋아요. 자전거길 기준으로 좋아요가 되고.
  // 한번 누르면 좋아요 , 다시한 누르면 좋아요 취소
  const userIdx = req.accountIdx;
  const roadName = req.params['roadName'];
  const testRoadName = await pool.query(selectRoadName, [roadName]);
  if (testRoadName.rows.length == 0) {
    throw new NotFoundError('알맞은 roadName이 아님');
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
  const testCenterIdx = await pool.query(selectCenterIdx, [centerIdx]);
  if (testCenterIdx.rows.length == 0) {
    throw new NotFoundError('알맞은 centerIdx값이 아님');
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
  const { sw, ne } = req.body;
  const result = await pool.query(selectPin, [sw.latitude, ne.latitude, sw.longitude, ne.longitude]);
  const resultData = result.rows;

  res.status(200).send({
    resultData
  });
});

export const giveInformationRoad = wrap(async (req, res, next) => {
  const roadIdx = req.params['roadIdx'];
  const roadResults = await pool.query(giveInformationRoadDB, [roadIdx]);
  if (roadResults.rows.length == 0) {
    return next(new NotFoundError('roadIdx가 유효하지 않음.'));
  }
  res.status(200).send({
    roads_lat_lng: [roadResults.rows[0].latitude, roadResults.rows[0].longitude],
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
  res.status(200).send({
    centers_lat_lng: [centerResults.rows[0].longitude, centerResults.rows[0].latitude],
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

  res.status(200).send({ Data: Data });
});

export const position = wrap(async (req, res, next) => {
  const roadIdx = req.body.roadIdx;
  const centerIdx = req.body.centerIdx;
  if (roadIdx) {
    const checkResults = await pool.query(givePositionRoad, [roadIdx]);
    if (checkResults.rows.length == 0) {
      return next(new NotFoundError('roadIdx가 유효하지 않음.'));
    }
    res.status(200).send({
      location: {
        longitude: checkResults.rows[0].longitude,
        latitude: checkResults.rows[0].latitude
      }
    });
  } else if (centerIdx) {
    const checkResults = await pool.query(givePositionCenter, [centerIdx]);
    if (checkResults.rows.length == 0) {
      return next(new NotFoundError('centerIdx가 유효하지 않음.'));
    }
    res.status(200).send({
      location: {
        longitude: checkResults.rows[0].longitude,
        latitude: checkResults.rows[0].latitude
      }
    });
  }
});
