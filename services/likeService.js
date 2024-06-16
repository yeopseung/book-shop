const { addLikeToDB, removeLikeFromDB } = require("../models/likeModel");
const { StatusCodes } = require("http-status-codes");
const { errorHandler, DatabaseError } = require("../utils/errorHandler");
const ensureAuthorization = require("../middlewares/auth");
const jwtErrorHandler = require("../utils/jwtErrorHandler");

const addLike = (req, res) => {
  try {
    const book_id = req.params.id;
    const authorization = ensureAuthorization(req);

    if (authorization instanceof Error) {
      return jwtErrorHandler(authorization, res);
    }

    addLikeToDB(authorization.id, book_id, (err, results) => {
      if (err) {
        return errorHandler(new DatabaseError("Database error occurred"), res);
      }
      return res.status(StatusCodes.CREATED).json(results);
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

const removeLike = (req, res) => {
  try {
    const book_id = req.params.id;
    const authorization = ensureAuthorization(req);

    if (authorization instanceof Error) {
      return jwtErrorHandler(authorization, res);
    }

    removeLikeFromDB(authorization.id, book_id, (err, results) => {
      if (err) {
        return errorHandler(new DatabaseError("Database error occurred"), res);
      }
      return res.status(StatusCodes.OK).json(results);
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

module.exports = {
  addLike,
  removeLike,
};
