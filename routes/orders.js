const express = require("express");
const router = express.Router();
const {
  order,
  getOrders,
  getOrderDetail,
} = require("../controller/OrderController");

router.use(express.json());

//* 주문하기
router.post("/", order);

//* 주문 목록 조회
router.get("/", getOrders);

//* 주문 상품 상세 조회
router.get("/:id", getOrderDetail);

module.exports = router;
