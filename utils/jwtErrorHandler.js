const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const jwtErrorHandler = (err, res) => {
  console.error(err);

  if (err instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요." });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
  }

  if (err instanceof jwt.NotBeforeError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "토큰이 아직 유효하지 않습니다." });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "JWT 처리 중 서버 오류가 발생했습니다." });
};

module.exports = jwtErrorHandler;
