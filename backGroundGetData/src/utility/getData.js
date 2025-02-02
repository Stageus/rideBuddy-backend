import axios from 'axios';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { insertWeatherData, selectAirStation, insertAirData, deleteAirData } from '../repository.js';
import pool from '../config/postgresql.js';

export const getAirData = async () => {
  // db에 저장된 서울 측정소 리스트

  const stationResults = await pool.query(selectAirStation);
  const stationList = stationResults.rows;
  // 데이터 저장전 db내용 삭제
  await pool.query(deleteAirData);

  const encodingServiceKey = process.env.AIR_SERVICE_KEY;
  const decodingServiceKey = decodeURIComponent(`${encodingServiceKey}`);
  // 40번 통신
  for (let station of stationList) {
    const airDataUrl = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty`;
    const airDataParams = {
      serviceKey: decodingServiceKey,
      returnType: 'json',
      stationName: station.station_name,
      dataTerm: 'DAILY',
      ver: 1.3
    };
    const airDataQuery = new URLSearchParams(airDataParams).toString();
    const airDataFetch = await fetch(`${airDataUrl}?${airDataQuery}`);
    const airDataResult = await airDataFetch.json();
    const airData = airDataResult.response.body.items[0];

    const pm10value = airData.pm10Value;
    const pm25value = airData.pm25Value;
    const pm10grade1h = airData.pm10Grade1h;
    const pm25grade1h = airData.pm25Grade1h;
    const surveyDateTime = airData.dataTime;

    await pool.query(insertAirData, [
      station.station_name,
      pm10value,
      pm25value,
      pm10grade1h,
      pm25grade1h,
      surveyDateTime
    ]);
  }
  return;
};
