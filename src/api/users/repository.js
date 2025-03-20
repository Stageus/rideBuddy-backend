//----------- 테준
export const checkGoogleId = `
    SELECT * FROM project.account 
    WHERE google_id = $1;
`;

export const insertGoogleId = `
    INSERT INTO project.account
    (account_name, google_id,token_type)
    VALUES($1,$2,$3);
`;

export const selectGoogleAccountIdx = `
    SELECT account_idx FROM project.account
    WHERE google_id = $1;
`;

export const checkDuplicateId = `
    SELECT account_idx FROM project.account
    WHERE id = $1;
`;

export const registerdb = `
    INSERT INTO project.account (id,account_name,pw,mail,token_type) 
    VALUES ($1,$2,$3,$4,$5);
`;

export const checkDuplicateMail = `
    SELECT mail FROM project.account
    WHERE mail = $1;
`;

export const insertMailToken = `
    INSERT INTO project.mail_code (token,code,status)
    VALUES ($1,$2,$3);
`;

export const mailVerifyDB = `
    SELECT token,code FROM project.mail_code
    WHERE token = $1 AND  code = $2;
`;

export const modifyMailToken = `
    UPDATE project.mail_code
    SET status = $1
    WHERE token = $2;
`;
export const checkMailToken = `
    SELECT token FROM project.mail_code
    WHERE token = $1;
`;
export const transMailToken_True = `
    UPDATE project.mail_code
    SET status = $1
    WHERE token = $2 AND code = $3;
`;
export const checkMailToken_True = `
    SELECT * FROM project.mail_code
    WHERE token = $1 AND  status = $2;
`;

export const deleteaccount = `
    DELETE FROM project.account
    WHERE account_idx = $1;
`;

export const correctaccount = `
    SELECT id,mail FROM project.account
    WHERE id = $1 AND mail = $2;
`;

export const checkMail = `
    UPDATE project.mail_code
    SET status = $1
    WHERE token = $2 AND code =$3;
`;
//------------ 이령
export const checkNaverId = `
    SELECT * FROM project.account 
    WHERE naver_id = $1;
`;

export const insertNaverId = `
    INSERT INTO project.account
    (account_name, naver_id,token_type)
    VALUES($1,$2,$3);
`;

export const selectUserPw = `
    SELECT account_idx ,pw FROM project.account 
    WHERE id = $1;`;

export const selectNaverAccountIdx = `
    SELECT account_idx FROM project.account
    WHERE naver_id = $1;
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

export const selectTokenType = `
    SELECT token_type FROM project.account
    WHERE account_idx = $1    
`;
