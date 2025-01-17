export const insertData = `
    INSERT INTO project.weather (token,code,status)
    VALUES ($1,$2,$3);
`;
export const insertWeatherData = `
    INSERT INTO project.weather (region_idx2,time,weather,temperature,rain)
    VALUES ($1,$2,$3,$4,$5);
`;

export const selectAirStation = `
    SELECT * FROM project.station_list
`;

export const insertAirData = `
    INSERT INTO project.current_air (station_name, pm10value, pm25value, pm10grade1h, pm25grade1h, survey_date_time)
    VALUES ($1,$2,$3,$4,$5,$6)
`;

export const deleteAirData = `
    DELETE FROM project.current_air
`;

export const deleteWeatherDatadb = `
    DELETE FROM project.weather
    WHERE time =$1;
`;

export const selectWeatherData = `
    SELECT * FROM project.weather_region_list
`;
