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

export const selectNaverAccountIdx = `
    SELECT account_idx FROM project.account
    WHERE naver_id = $1;
`;

export const selectLocalAccountIdx = `
    SELECT account_idx FROM project.account
    WHERE id = $1;
`;

export const insertPw = `
    INSERT INTO project.account (account_id, pw, account_name) 
    VALUES($1,$2,$3);
`;

export const updatePwFromId = `
    UPDATE project.account SET pw = $1 
    WHERE id = $2
`;

export const updatePwFromIdx = `
    UPDATE project.account SET pw = $1 
    WHERE account_idx = $2
`;

export const findAccountId = `
    SELECT id FROM project.account
    WHERE account_name = $1 AND mail = $2
`;
