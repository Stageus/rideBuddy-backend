import { StatusCodes } from 'http-status-codes';
class CustomError extends Error {
  constructor(message) {
    super(message);
  }
}
//

export class BadRequestError extends CustomError {
  //400
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class UnauthorizedError extends CustomError {
  // 401
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export class ForbiddenError extends CustomError {
  //403
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export class NotFoundError extends CustomError {
  //404
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export class ConflictError extends CustomError {
  // 409
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}
