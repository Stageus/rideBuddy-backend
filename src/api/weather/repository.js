export const getWeather = `
    SELECT * FROM project.weather
    WHERE si_do  = $1 AND si_gun_gu  = $2;
`;
