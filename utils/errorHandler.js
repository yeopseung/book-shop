const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, res) => {
  console.error(err);

  switch (err.name) {
    case "ReferenceError":
      return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });

    case "NotFoundError":
      return res.status(StatusCodes.NOT_FOUND).json({ message: err.message });

    case "ValidationError":
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `유효성 검사 실패: ${err.message}` });

    case "DatabaseError":
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "데이터베이스 오류가 발생했습니다." });

    default:
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "서버 오류가 발생했습니다." });
  }
};

module.exports = errorHandler;
