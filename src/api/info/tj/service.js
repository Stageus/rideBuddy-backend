import {
  givepositionRoad,
  givepositionCenter,
  giveInformationRoadDB,
  giveInformationCenterDB,
  searchRoad,
  searchCenter
} from './repository.js';
import pool from '#config/postgresql.js';
import wrap from '#utility/wrapper.js';
import { BadRequestError, NotFoundError } from '#utility/customError.js';
export const giveInformationRoad = wrap(async (req, res, next) => {
  const roadIdx = req.params['roadIdx'];
  console.log(roadIdx);
  const roadResults = await pool.query(giveInformationRoadDB, [roadIdx]);
  console.log(roadResults.rows[0]);
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
  console.log(centerIdx);
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
  console.log(search);
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
  console.log(Data);

  res.status(200).json({ Data: Data });
});

export const position = wrap(async (req, res, next) => {
  const roadIdx = req.body.roadIdx;
  const centerIdx = req.body.centerIdx;
  if (roadIdx) {
    const checkResults = await pool.query(givepositionRoad, [roadIdx]);
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
    const checkResults = await pool.query(givepositionCenter, [centerIdx]);
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
