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
let DATABASE;

db.init()
  .then((r) => {
    DATABASE = r;
    app.listen((port = 80), () => {
      console.log(`server started, port: ${port}`);


      db.SQL.select(DATABASE.ACCOUNTS);
      
      
    });
  })
  .catch((err) => console.log(err));
