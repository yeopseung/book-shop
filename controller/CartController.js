const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");

dotenv.config();

const addToCart = (req, res) => {
  const { book_id, quantity, user_id } = req.body;

  const sql =
    "INSERT INTO cart_items(book_id, quantity, user_id) VALUES (?,?,?)";

  const values = [book_id, quantity, user_id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

const getCartItems = (req, res) => {
  const { user_id, selected } = req.body;
  const sql = `SELECT cart_items.id, book_id, title, summary, quantity, price 
    FROM cart_items LEFT JOIN books ON cart_items.book_id = books.id
    WHERE user_id=? AND cart_items.id IN(?)`;
  const values = [user_id, selected];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

const removeCartItem = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM cart_items WHERE id = ?";

  conn.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addToCart,
  getCartItems,
  removeCartItem,
};
