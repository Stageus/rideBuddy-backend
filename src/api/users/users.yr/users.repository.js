export const checkNaverId = `
    SELECT * FROM account 
    WHERE naver_id = ?;
`;

export const insertNaverId = `
    INSERT INTO account
    (account_name, naver_id)
    VALUES(?,?);
`;
