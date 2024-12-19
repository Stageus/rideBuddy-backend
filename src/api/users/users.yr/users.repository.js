export const checkNaverId = `
    SELECT * FROM project.account 
    WHERE naver_id = $1;
`;

export const insertNaverId = `
    INSERT INTO project.account
    (account_name, naver_id)
    VALUES($1,$2);
`;

export const selectUserPw = `
    SELECT pw FROM project.account 
    WHERE id = $1;`;

export const selectAccountIdx = `
    SELECT account_idx FROM project.account
    WHERE naver_id = $1;
`;
