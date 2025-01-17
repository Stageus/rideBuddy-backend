export const getWeather = `
    SELECT * FROM project.weather_region_list
    WHERE si_do  = $1 AND si_gun_gu  = $2;
`;
export const getData = `
    SELECT * FROM project.weather
    WHERE region_idx2 = $1;
`;

export const selectAirData = `
    SELECT * from project.current_air
    WHERE station_name = $1
`;
