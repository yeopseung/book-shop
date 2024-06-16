const { addLike, removeLike } = require("../services/likeService");

const addLikeController = (req, res) => {
  addLike(req, res);
};

const removeLikeController = (req, res) => {
  removeLike(req, res);
};

module.exports = {
  addLikeController,
  removeLikeController,
};
