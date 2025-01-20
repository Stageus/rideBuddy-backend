import { BadRequestError, NotFoundError, ForbiddenError } from '#utility/customError.js';

export const verifyReq = (page, nx, ny) => {
  if (!page || !nx || !ny) {
    throw new BadRequestError('올바른 req값이 아님');
  }
  if (!(nx >= 124 && nx <= 132 && ny >= 33 && ny <= 43)) {
    throw new BadRequestError('올바른 위경도값이 아님');
  }
};
