export const CenterByDistance = `
   SELECT center_idx, center_name, center_address, centerlist.cal 
   FROM (SELECT * , calcDistance($2, $3, latitude, longitude) AS cal 
   FROM project.center) AS centerlist
   ORDER BY centerlist.cal ASC
   LIMIT 20 offset $1 * 20;
`;
export const roadByDistance = `
   SELECT road_point_idx, road_name,road_type,road_address,roadlist.cal 
   FROM (SELECT * , calcDistance($2, $3, latitude, longitude) AS cal 
   FROM project.road_point) AS roadlist
   FULL OUTER JOIN project.road 
   ON road.road_idx = roadlist.road_idx
   ORDER BY roadlist.cal ASC
   LIMIT 20 offset $1 * 20;
`;

export const searchData = `
    (select 
        center_idx as idx, 
        center_name as name, 
        latitude, 
        longitude, 
        center_address as address , 
        'center_point' as type , 
        calcDistance($3, $4, latitude, longitude) AS distance 
    from project.center 
    where center_name like $1)
    union all
    (select 
        road_point_idx as idx, 
        road_name as name, 
        latitude, 
        longitude, 
        road_address as address , 
        road_type as type ,
        calcDistance($3, $4, latitude, longitude) AS distance
    from project.road_point
    FULL OUTER JOIN project.road 
    ON road.road_idx = road_point.road_idx
    where road_name like $1) 
    order by distance ASC
    limit 20 offset $2*20;
`;

export const selectPin = `
    select *
    from (
        (select     
            center_idx as idx, 
            center_name as name, 
            latitude, 
            longitude, 
            center_address as address , 
            'center_point' as type 
        from project.center )
    union all
        (select 
            road_point_idx as idx, 
            road_name as name, 
            latitude, 
            longitude, 
            road_address as address , 
            road_type as type 
        from project.road_point 
        FULL OUTER JOIN project.road 
        ON road.road_idx = road_point.road_idx
        )
    ) as foo
    where $1 < latitude AND $2 >latitude AND $3<longitude AND $4 >longitude
`;

export const insertAddress = `
    UPDATE project.center
    SET center_address = $1
    WHERE center_idx = $2
`;

export const insertAccountRoadLike = `
    INSERT INTO project.account_road_like (account_idx, road_idx)
    VALUES ($1,$2)
`;

export const selectAccountRoadLike = `
    SELECT * FROM project.account_road_like 
    WHERE account_idx = $1 AND road_idx = $2
`;

export const deleteAccountRoadLike = `
    DELETE FROM project.account_road_like
    WHERE account_idx = $1 AND road_idx = $2
`;
export const plusRoadLikeNum = `
    UPDATE project.road
    SET road_like = (SELECT road_like FROM project.road WHERE road_idx = $1) + 1 
    WHERE road_idx = $1
`;
export const minusRoadLikeNum = `
    UPDATE project.road
    SET road_like = (SELECT road_like FROM project.road WHERE road_idx = $1) - 1 
    WHERE road_idx = $1
`;
export const selectRoadLikeNum = `
    SELECT road_like FROM project.road
    WHERE road_idx = $1
`;

export const selectRoadIdx = `
    SELECT * FROM project.road
    WHERE road_idx = $1
`;

export const selectCenterIdx = `
    SELECT * FROM project.center
    WHERE center_idx = $1
`;
export const selectAccountCenterLike = `
    SELECT * FROM project.account_center_like
    WHERE account_idx = $1 AND center_idx = $2
`;
export const insertAccountCenterLike = `
    INSERT INTO project.account_center_like (account_idx, center_idx)
    VALUES ($1,$2)
`;
export const plusCenterLikeNum = `
    UPDATE project.center
    SET center_like = (SELECT center_like FROM project.center WHERE center_idx = $1) + 1 
    WHERE center_idx = $1
`;
export const deleteAccountCenterLike = `
    DELETE FROM project.account_center_like
    WHERE account_idx = $1 AND center_idx = $2
`;
export const minusCenterLikeNum = `
    UPDATE project.center
    SET center_like = (SELECT center_like FROM project.center WHERE center_idx = $1) - 1
    WHERE center_idx = $1   
`;
export const selectCenterLikeNum = `
    SELECT center_like FROM project.center
    WHERE center_idx = $1
`;

export const giveInformationRoadDB = `
    SELECT latitude, longitude, road_address FROM project.road_point
    WHERE road_idx = $1;
`;

export const giveInformationCenterDB = `
    SELECT center_name, latitude, longitude, center_address, center_like FROM project.center
    WHERE center_idx = $1;
`;

export const givePositionRoad = `
    SELECT latitude, longitude FROM project.road_point
    WHERE road_idx = $1;
`;

export const givePositionCenter = `
    SELECT latitude, longitude FROM project.center
    WHERE center_idx = $1;
`;

export const road_like = `
    SELECT road_name, road_like FROM project.road
    WHERE road_idx = $1;
`;

export const searchRoad = `
SELECT road_name FROM project.road WHERE road_name LIKE $1 LIMIT 20;
`;
export const searchCenter = `
SELECT center_name FROM project.center WHERE center_name LIKE $1 LIMIT 20;
`;
