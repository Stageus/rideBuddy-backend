import moment from 'moment';
import { getAirData } from './utility/getData.js';
import wrap from './utility/wrapper.js';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import path from 'path';
import csv from 'csv-parser';
import {
  insertWeatherData,
  selectAirStation,
  insertAirData,
  deleteAirData,
  deleteWeatherDatadb,
  selectWeatherData
} from './repository.js';
import pool from './config/postgresql.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __filename = fileURLToPath(import.meta.url);

export const getWeatherData = async (date, time, next) => {
  //252번 통신해야함
  //정해진 시간에 통신해야함 (02,05,08,11,14,17,20,23) 8번 통신해야함.
  //타겟 타임 설정후 그 시간이 되면 프로그램 시작.
  //req로 시작과, 설정 시간 전송해줌
  // 252번 돌린다. 파일 list 파일 참고해서 돌리면 된다.

  // console.log(date, time);

  try {
    const data = await pool.query(selectWeatherData);
    const rows = data.rows;
    const results = rows.map((row) => ({
      xp: row.region_line_xp,
      yp: row.region_line_yp
    }));
    console.log(results[0]);

    if (time == 0) {
      time = '0000';
    } else if (time <= 9) {
      time = '0' + time + '00';
    } else {
      time = time + '00';
    }

    console.log(time);

    var ny;
    var nx;
    var url;
    var response;

    for (let i = 1; i <= 252; i++) {
      nx = results[i - 1]['xp'];
      ny = results[i - 1]['yp'];

      console.log(nx, ny, process.env.DATA_API_KEY, date, time);

      url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.DATA_API_KEY}&numOfRows=100&pageNo=1&base_date=${date}&base_time=${time}&nx=${nx}&ny=${ny}&dataType=JSON`;
      console.log(url);
      response = await axios.get(url);
      var weatherData = response.data.response.body.items;
      weatherData = Object.values(weatherData);
      const flattenedWeatherData = weatherData.flat();
      const filteredTMP = flattenedWeatherData.filter((item) => item.category === 'TMP');
      const filteredPCP = flattenedWeatherData.filter((item) => item.category === 'PCP');
      const filteredPTY = flattenedWeatherData.filter((item) => item.category === 'PTY');

      console.log(filteredPTY);
      console.log(filteredPCP);

      for (let j = 0; j < 7; j++) {
        if (filteredPCP[j]['fcstValue'] === '강수없음') {
          await pool.query(insertWeatherData, [
            i,
            filteredTMP[j]['fcstTime'],
            0,
            filteredTMP[j]['fcstValue'],
            filteredPTY[j]['fcstValue']
          ]);
        } else if (filteredPCP[j]['fcstValue'] === '50.0mm 이상') {
          await pool.query(insertWeatherData, [
            i,
            filteredTMP[j]['fcstTime'],
            '50',
            filteredTMP[j]['fcstValue'],
            filteredPTY[j]['fcstValue']
          ]);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// 일단 서울만 기능하도록 함. 2시간에 한번씩 호출로 함.
export const airTimeCheck = async (req, res) => {
  const currentTime = new Date(); //.toString();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const loadTime = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
  let leftHours;
  let leftMinutes;

  // 정각일때 남은시간 계산
  if (currentMinutes == 0) {
    leftHours = 2; // 2시간 남음
    leftMinutes = 0;
    await getAirData();
  } else {
    // 정각이 아닐때 남은시간 계산
    for (let time of loadTime) {
      if (currentHours > time) {
        continue;
      } else if (currentHours == time) {
        leftHours = 1;
        leftMinutes = 60 - currentMinutes;
        break;
      } else if (currentHours < time) {
        leftHours = 0;
        leftMinutes = 60 - currentMinutes;
        break;
      }
    }
    // 남은시간이 지나면 getAirData 호출 하고, 그 이후 2시간 마다 한번씩 호출
    try {
      setTimeout(
        async () => {
          const time = new Date().toString();
          console.log('주기적으로 함수실행중, 현재시간 :', time);
          await getAirData();
          try {
            setInterval(
              async () => {
                const time = new Date().toString();
                console.log('주기적으로 함수실행중, 현재시간: ', time);
                await getAirData();
              },
              1000 * 60 * 60 * 2
            );
          } catch (err) {
            console.log('error 발생');
          }
        },
        1000 * 60 * (leftMinutes + 60 * leftHours)
      );
    } catch (err) {
      console.log('error 발생');
    }
  }
};

export const deleteWeatherData = async (time, req, res) => {
  const hour = time + '00';
  await pool.query(deleteWeatherDatadb, [hour]);
};
