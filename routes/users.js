const express = require("express");
const {
  join,
  login,
  requestPasswordReset,
  resetPassword,
} = require("../controller/UserController");

const router = express.Router();
router.use(express.json());

//* 회원 가입
router.post("/join", join);

//* 로그인
router.post("/login", login);

//* 비밀번호 초기화 요청
router.post("/reset", requestPasswordReset);

//* 비밀번호 초기화
router.put("/reset", resetPassword);

module.exports = router;
