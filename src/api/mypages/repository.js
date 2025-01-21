export const selectLoginType = `
    SELECT token_type FROM project.account
    WHERE account_idx = $1
`;

export const selectInfoForLocal = `
    SELECT account_name, id, mail FROM project.account
    WHERE account_idx = $1
`;
export const selectInfoForOAuth = `
    SELECT account_name FROM project.account
    WHERE account_idx = $1
`;

export const selectInfo = `
    SELECT account_name, id, mail
    FROM project.account
    WHERE account_idx = $1 
`;

export const selectProfile = `
    SELECT img_url
    FROM project.profile_img
    WHERE created_at = (
        SELECT MAX(created_at) FROM project.profile_img
        WHERE account_idx = $1
    )
`;

export const insertProfile = `
    INSERT INTO project.profile_img (account_idx, img_url)
    VALUES ($1,$2)
`;

export const selectHistory = `
    SELECT img_idx, img_url, created_at
    FROM project.profile_img
    WHERE account_idx = $1
    ORDER BY created_at DESC
`;

export const deleteImg = `
    DELETE FROM project.profile_img
    WHERE img_idx = $1
`;
export const selectUserRoad = `
    SELECT road_name, line_xp, line_yp 
    FROM project.road
    WHERE road_type = 'start' AND 
    road_name IN (
    SELECT road_name FROM project.account_road_like
    WHERE account_idx = $1) 
`;
export const selectUserCenter = `
    SELECT center_name, line_xp, line_yp 
    FROM project.center
    WHERE center_idx IN
    (SELECT center_idx FROM project.account_center_like
    WHERE account_idx = $1) 
`;
