const DB_NAMESPACE = {
  CONN: {
    HOST: "127.0.0.1",
    USER: "ROOT",
    PASSWORD: "0000",
    DATABASE: "AIG_SERVER_DEMO",
  },
  RES_MSG: {
    OK: "요청 성공적",
    BAD_REQUEST: "유효하지 않은 요청",
    NOT_FOUND: "해당 데이터 없음",
    INTERNAL_SERVER_ERROR: "서버 내부 에러",
    //
    IS_NOT_VALID: "자료형이 다르거나 인자의 개수가 다름",
    INSUFFICIENT_VALUE: "필요한 인자가 제공되지 않음",
  },
};

module.exports = DB_NAMESPACE;
