export const giveInformationRoadDB = `
    SELECT road_name, road_line_xp, road_line_yp, road_address, road_like FROM project.road
    WHERE road_idx = $1;
`;

export const giveInformationCenterDB = `
    SELECT center_name, center_line_xp, center_line_yp, center_address, center_like FROM project.center
    WHERE center_idx = $1;
`;

export const givepositionRoad = `
    SELECT road_line_xp, road_line_yp FROM project.road
    WHERE road_idx = $1;
`;

export const givepositionCenter = `
    SELECT center_line_xp, center_line_yp FROM project.center
    WHERE center_idx = $1;
`;

export const searchRoad = `
    SELECT road_name FROM project.road
    WHERE road_name LIKE $1;
`;

export const searchCenter = `
    SELECT center_name FROM project.center
    WHERE center_name LIKE $1;
`;
