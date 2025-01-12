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

export const selectProfile = `
    SELECT img_url
`;
