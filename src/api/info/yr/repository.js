export const selectXp = `
    SELECT center_line_xp FROM project.center
    WHERE center_idx = $1
`;

export const selectYp = `
    SELECT center_line_yp FROM project.center
    WHERE center_idx = $1
`;

export const insertAddress = `
    UPDATE project.center
    SET center_address = $1
    WHERE center_idx = $2
`;

export const selectCenter = `
    SELECT * FROM project.center
`;
