const express = require("express");
const app = express();

app.use(express.json(), (err, req, res, next) => {
  if (err instanceof SyntaxError) {
    res.status(400);
    res.send({ status: "400", data: null, message: "구문 잘못됨" });
  } else {
    next();
  }
});
app.use(express.urlencoded({ extended: false }));

const db = require("./DB");

app.listen((port = 80), () => {
  console.log("SERVER RUNNING ON PORT: ", port);
});

app.post("/login", (req, res) => {
  // 요청: POST {"EMAIL":"이메일","PASSWORD":"비밀번호"} 혹은 {"ACCOUNT_UUID":" 계정UUID ","PASSWORD":"비밀번호"}
  db.accounts.login(req.body, res);
});

app
  .route("/accounts")
  .post((req, res) => {
    // 요청: POST ["계정UUID","이메일","비밀번호","소속"]
    db.accounts.register(req.body, res);
  })
  .put((req, res) => {
    // 요청: PUT {"ACCOUNT_UUID":" 계정UUID ","CUR_PASSWORD":"비밀번호","NEW_PASSWORD":"새 비밀번호"}
    db.accounts.changePassword(req.body, res);
  })
  .delete((req, res) => {});
