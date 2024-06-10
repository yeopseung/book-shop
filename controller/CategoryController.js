const conn = require("../config/mariadb");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");

dotenv.config();

const allCategory = (req, res) => {
  const sql = "SELECT * FROM categories";

  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.CREATED).json(results);
  });
};

module.exports = {
  allCategory,
};
