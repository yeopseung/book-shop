const express = require("express");
const router = express.Router();
const {
  allBooks,
  bookDetail,
  booksByCategory,
} = require("../controller/BookController");

router.use(express.json());

//* (카테고리별, 신간 여부) 전체 도서 조회 
router.get("/", allBooks);

//* 개별 도서 조회
router.get("/:id", bookDetail);

module.exports = router;
