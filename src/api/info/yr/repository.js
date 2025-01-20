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
    SELECT * FROM project.center
    WHERE center_name LIKE $1
`;

export const searchRoad = `
    SELECT * FROM project.road
    WHERE road_name LIKE $1
`;
