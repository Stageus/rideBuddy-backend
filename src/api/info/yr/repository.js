export const selectXp = `
    SELECT line_xp FROM project.center
    WHERE center_idx = $1
`;

export const selectYp = `
    SELECT line_yp FROM project.center
    WHERE center_idx = $1
`;

export const insertAddress = `
    UPDATE project.center
    SET center_address = $1
    WHERE center_idx = $2
`;

export const selectCenters = `
    SELECT * FROM project.center
`;

export const selectRoads = `
    SELECT * FROM project.road
`;

export const searchCenter = `
    SELECT * FRPM project.center
    WHRER center_name LIKE $1
`;

export const searchRoad = `
    SELECT * FRPM project.road
    WHRER road_name LIKE $1
`;
