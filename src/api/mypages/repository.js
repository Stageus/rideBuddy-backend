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

export const beforeDeleteImg = `
    SELECT * FROM project.profile_img
    WHERE img_idx = $1 AND account_idx = $2;
`;

export const deleteImg = `
    DELETE FROM project.profile_img
    WHERE img_idx = $1 AND account_idx = $2;
`;
export const selectUserRoad = `
    SELECT r.road_name, rp.latitude, rp.longitude 
    FROM project.road_point rp
    FULL OUTER JOIN project.road r ON
    rp.road_idx = r.road_idx
    WHERE rp.road_type = 'start' AND 
    rp.road_idx IN (
    SELECT road_idx FROM project.account_road_like
    WHERE account_idx = $1) 
    limit 20 offset $2 * 20;
`;
export const selectUserCenter = `
    SELECT center_name, latitude, longitude 
    FROM project.center
    WHERE center_idx IN
    (SELECT center_idx FROM project.account_center_like
    WHERE account_idx = $1) 
    limit 20 offset $2 * 20;
`;
