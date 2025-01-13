import {
  givepositionRoad,
  givepositionCenter,
  giveInformationRoadDB,
  giveInformationCenterDB,
  searchRoad,
  searchCenter
} from './repository.js';
import pool from '#config/postgresql.js';

export const giveInformationRoad = async (req, res) => {
  const roadIdx = req.params['roadIdx'];
  console.log(roadIdx);
  const roadResults = await pool.query(giveInformationRoadDB, [roadIdx]);
  res.status(200).json({
    roads_lat_lng: [roadResults.rows[0].road_line_xp, roadResults.rows[0].road_line_yp],
    roads_idx: roadIdx,
    roads_name: roadResults.rows[0].road_name,
    roads_address: roadResults.rows[0].road_address,
    road_likeCount: roadResults.rows[0].road_like
  });
};

export const giveInformationCenter = async (req, res) => {
  const centerIdx = req.params['centerIdx'];
  console.log(centerIdx);
  const centerResults = await pool.query(giveInformationCenterDB, [centerIdx]);
  res.status(200).json({
    centers_lat_lng: [centerResults.rows[0].center_line_xp, centerResults.rows[0].center_line_yp],
    centers_idx: centerIdx,
    centers_name: centerResults.rows[0].center_name,
    centers_address: centerResults.rows[0].center_address,
    center_likeCount: centerResults.rows[0].center_like
  });
};

export const position = async (req, res) => {
  const roadIdx = req.body.roadIdx;
  const centerIdx = req.body.centerIdx;
  if (roadIdx) {
    const checkResults = await pool.query(givepositionRoad, [roadIdx]);
    res.status(200).json({
      road_line_xp: checkResults.rows[0].road_line_xp,
      road_line_yp: checkResults.rows[0].road_line_yp
    });
  } else if (centerIdx) {
    const checkResults = await pool.query(givepositionCenter, [centerIdx]);
    res.status(200).json({
      center_line_xp: checkResults.rows[0].center_line_xp,
      center_line_yp: checkResults.rows[0].center_line_yp
    });
  }
};

export const search = async (req, res) => {
  const search = req.body.search;

  const RoadResults = await pool.query(searchRoad, [`%${search}%`]);
  const centerResults = await pool.query(searchCenter, [`%${search}%`]);
  console.log('RoadResult:', RoadResults.rows[0]);
  console.log('centerResults:', centerResults.rows[0]);

  res.status(200).json({});
};
