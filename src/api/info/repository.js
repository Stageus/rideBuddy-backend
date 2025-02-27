export const CenterByDistance = `
   SELECT center_idx, latitude, longitude, center_name, center_address, centerlist.distance , center_like
   FROM (SELECT * , calcDistance($2, $3, latitude, longitude) AS distance
   FROM project.center) AS centerlist
   ORDER BY centerlist.distance ASC
   LIMIT 20 offset $1 * 20;
`;
export const roadByDistance = `
   SELECT 
        roadlist.road_point_idx, 
        r.road_idx, 
        roadlist.latitude,
        roadlist.longitude, 
        r.road_name, 
        roadlist.road_type, 
        roadlist.road_address, 
        roadlist.distance,
        r.road_like 
   FROM (SELECT * , calcDistance($2, $3, latitude, longitude) AS distance
   FROM project.road_point) AS roadlist 
   FULL OUTER JOIN project.road r
   ON r.road_idx = roadlist.road_idx
   ORDER BY roadlist.distance ASC
   LIMIT 20 offset $1 * 20;
`;

export const searchData = `
    (select 
        'center' as result,
        center_idx as idx,
        0 as pointidx,
        center_name as name, 
        latitude, 
        longitude, 
        center_address as address , 
        'center_point' as type , 
        calcDistance($3, $4, latitude, longitude) AS distance,
        center_like as like
    from project.center 
    where center_name like $1)
    union all
    (select 
        'road' as result,
        rp.road_idx as idx,
        rp.road_point_idx as pointidx, 
        r.road_name as name, 
        rp.latitude, 
        rp.longitude, 
        rp.road_address as address , 
        rp.road_type as type ,
        calcDistance($3, $4, rp.latitude, rp.longitude) AS distance,
        r.road_like as like
    from project.road_point rp
    FULL OUTER JOIN project.road r
    ON r.road_idx = rp.road_idx
    where r.road_name like $1) 
    order by distance ASC
    limit 20 offset $2*20;
`;

export const selectPin = `
    select *
    from (
        (select
            'center' as result,     
            center_idx as idx, 
            0 as pointidx,
            center_name as name, 
            latitude, 
            longitude, 
            center_address as address , 
            'center_point' as type,
            center_like as like
        from project.center )
    union all
        (select 
            'road' as result,  
            road.road_idx as idx,
            road_point_idx as pointidx, 
            road_name as name, 
            latitude, 
            longitude, 
            road_address as address , 
            road_type as type,
            road.road_like as like
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
    SELECT road_type, latitude, longitude, road_address FROM project.road_point
    WHERE road_idx = $1;
`;

export const giveInformationCenterDB = `
    SELECT center_name, latitude, longitude, center_address, center_like FROM project.center
    WHERE center_idx = $1;
`;

export const givePositionRoad = `
    SELECT latitude, longitude FROM project.road_point
    WHERE road_point_idx = $1;
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
