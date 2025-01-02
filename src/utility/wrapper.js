export const wrapController = (fn) => {
  return (req, res, next) => {
    try {
      fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export const wrapAsyncController = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
