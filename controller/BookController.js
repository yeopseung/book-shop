const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");

dotenv.config();

const allBooks = (req, res) => {
  const { category_id, news, limit, current_page } = req.query;
  const offset = limit * (current_page - 1);

  let sql =
    "SELECT *, (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes FROM books";
  let values = [];

  if (category_id && news) {
    sql +=
      "  WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values.push(category_id);
  } else if (category_id) {
    sql += " WHERE category_id=?";
    values.push(category_id);
  } else if (news) {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), offset);

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

const bookDetail = (req, res) => {
  const book_id = parseInt(req.params.id);
  const { user_id } = req.body;

  const sql = `SELECT * ,
    (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes,
    (SELECT EXISTS(SELECT * from likes WHERE user_id=? AND liked_book_id=?)) AS liked 
    FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?`;

  const values = [user_id, book_id, book_id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results[0]) {
      return res.status(StatusCodes.OK).json(results[0]);
    }

    return res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = {
  allBooks,
  bookDetail,
};
