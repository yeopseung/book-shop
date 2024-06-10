const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
const ensureAuthorization = require("../auth");

dotenv.config();

const allBooks = (req, res) => {
  let allBooksRes = {};

  const { category_id, news, limit, current_page } = req.query;
  const offset = limit * (current_page - 1);

  let sql =
    "SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes FROM books";
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

    if (results.length) allBooksRes.books = results;
    else return res.status(StatusCodes.NOT_FOUND).end();
  });

  sql = "SELECT found_rows()";
  values.push(parseInt(limit), offset);

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const totalCount = results[0]["found_rows()"];
    let pagination = {};
    pagination.currentPage = current_page
    pagination.totalCount = totalCount;

    allBooksRes.pagination = pagination;
    
    return res.status(StatusCodes.OK).json(results);
  });
};

const bookDetail = (req, res) => {
  const book_id = parseInt(req.params.id);

  const authorization = ensureAuthorization(req);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요." });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 토큰입니다." });
  }

  const sql = `SELECT * ,
    (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes,
    (SELECT EXISTS(SELECT * from likes WHERE user_id=? AND liked_book_id=?)) AS liked 
    FROM books LEFT JOIN categories ON books.category_id = category.category_id WHERE books.id = ?`;

  const values = [authorization.id, book_id, book_id];

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
