const mariadb = require("mysql2/promise");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
const ensureAuthorization = require("../auth");

dotenv.config();

const order = async (req, res) => {
  if (authorization instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요." });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 토큰입니다." });
  }

  const conn = await mariadb.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "BookShop",
    dateStrings: true,
  });

  const { items, delivery, totalQuantity, totalPrice, firstBookTitle } =
    req.body;

  // 배송 데이터 삽입
  let sql = `INSERT INTO deliveries(address, receiver, contact) VALUES(?,?,?)`;
  let values = [delivery.address, delivery.receiver, delivery.contact];
  let [results] = await conn.execute(sql, values);
  const deliveryId = results.insertId;

  // 주문 데이터 삽입
  sql =
    "INSERT INTO orders(book_title, total_quantity, total_price, user_id, delivery_id) VALUES(?,?,?,?,?)";
  values = [firstBookTitle, totalQuantity, totalPrice, authorization.id, deliveryId];
  [results] = await conn.execute(sql, values);
  const orderId = results.insertId;

  console.log(items);

  // 장바구니 도서 정보 불러오기
  sql = "SELECT book_id, quantity FROM cart_items WHERE id IN (?)";
  const [orderItems, fields] = await conn.query(sql, [items]);

  // 주문된 도서 데이터 삽입
  sql = "INSERT INTO ordered_books(order_id, book_id, quantity) VALUES ?";
  values = [];
  orderItems.forEach((item) => {
    values.push([orderId, item.book_id, item.quantity]);
  });
  [results] = await conn.query(sql, [values]);

  // 주문된 도서 장바구니에서 삭제
  [reuslts] = await deleteCartItems(conn, items);

  return res.status(StatusCodes.OK).json(results);
};

const deleteCartItems = async (conn, items) => {
  const sql = "DELETE FROM cart_items WHERE id IN (?)";

  const result = await conn.query(sql, [items]);
  return result;
};

const getOrders = async (req, res) => {
  if (authorization instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요." });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 토큰입니다." });
  }

  const conn = await mariadb.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "BookShop",
    dateStrings: true,
  });

  const sql = `SELECT orders.id, book_title, total_quantity, total_price, created_at, address, receiver, contact 
    FROM orders LEFT JOIN deliveries ON orders.delivery_id = delivery_id`;

  const [rows, fields] = await conn.query(sql);

  return res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req, res) => {
  if (authorization instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요." });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 토큰입니다." });
  }
  
  const orderId = req.params;

  const conn = await mariadb.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "BookShop",
    dateStrings: true,
  });

  const sql = `SELECT book_id, title, author, price, quantity
        FROM ordered_books LEFT JOIN books ON ordered_books.book_id = books.id 
        WHERE order_id = ?`;

  const [rows, fields] = await conn.query(sql, orderId);

  return res.status(StatusCodes.OK).json(rows);
};

module.exports = {
  order,
  getOrders,
  getOrderDetail,
};
