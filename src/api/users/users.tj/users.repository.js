export const checkGoogleId = `
    SELECT * FROM project.account 
    WHERE google_id = $1;
`;

export const insertGoogleId = `
    INSERT INTO project.account
    (account_name, google_id)
    VALUES($1,$2);
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
    INSERT INTO project.account (id,account_name,pw,mail) 
    VALUES ($1,$2,$3,$4);
`;