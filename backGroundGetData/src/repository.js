export const insertData = `
    INSERT INTO project.weather (token,code,status)
    VALUES ($1,$2,$3);
`;
export const insertWeatherData = `
    INSERT INTO project.weather (region_idx2,time,weather,temperature,rain)
    VALUES ($1,$2,$3,$4,$5);
`;
