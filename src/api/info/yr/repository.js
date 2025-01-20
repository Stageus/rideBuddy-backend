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

export const insertAccountLike = `
    INSERT INTO project.account_road_like (account_idx, road_name)
    VALUES ($1,$2)
`;

export const selectAccountLike = `
    SELECT * FROM project.account_road_like 
    WHERE account_idx = $1 AND road_name = $2
`;

export const deleteAccountLike = `
    DELETE FROM project.account_road_like
    WHERE account_idx = $1 AND road_name = $2
`;
export const plusLikeNum = `
    UPDATE project.road_like_count
    SET road_like = (SELECT road_like FROM project.road_like_count WHERE road_name = $1) + 1 
    WHERE road_name = $1
`;
export const minusLikeNum = `
    UPDATE project.road_like_count
    SET road_like = (SELECT road_like FROM project.road_like_count WHERE road_name = $1) - 1 
    WHERE road_name = $1
`;
export const selectLikeNum = `
    SELECT road_like FROM project.road_like_count
    WHERE road_name = $1
`;

export const selectRoadName = `
    SELECT * FROM project.road_like_count
    WHERE road_name = $1
`;
