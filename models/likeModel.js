const conn = require("../config/mariadb");

const addLikeToDB = (userId, bookId, callback) => {
  const sql = "INSERT INTO likes (user_id, liked_book_id) VALUES(?,?)";
  const values = [userId, bookId];
  conn.query(sql, values, callback);
};

const removeLikeFromDB = (userId, bookId, callback) => {
  const sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
  const values = [userId, bookId];
  conn.query(sql, values, callback);
};

module.exports = {
  addLikeToDB,
  removeLikeFromDB,
};
