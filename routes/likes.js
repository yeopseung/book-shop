const express = require("express");
const router = express.Router();
const {
  addLikeController,
  removeLikeController,
} = require("../controller/LikeController");

router.use(express.json());

//* 좋아요 추가
router.post("/:id", addLikeController);

//* 좋아요 삭제
router.delete("/:id", removeLikeController);

module.exports = router;
