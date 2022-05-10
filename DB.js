const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "aig_server_demo",
});

const Response = class {
  constructor(_data) {
    this.data = _data;
  }
  sendResponse(res) {
    res.send({
      data: this.data,
      status: this.status,
      message: this.message,
    });
  }
  OK(res) {
    res.status(200);
    this.status = 200;
    this.message = null;
    console.log(this);
    this.sendResponse(res);
  }
  badRequest(res) {
    res.status(400);
    this.status = 400;
    this.message = "유효하지 않은 요청";
    this.sendResponse(res);
  }
  notFound(res) {
    res.status(404);
    this.status = 404;
    this.message = "해당 데이터 없음";
    this.sendResponse(res);
  }
  internalServerError(res) {
    res.status(500);
    this.status = 500;
    this.message = "500";
  }
};

const query = async function (sql) {
  let promise = new Promise((resolve, reject) => {
    connection.query(sql, (err, rows, fields) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  })
  return await promise;
};

const where = function (objArr) {
  if (!objArr) return null;
  let str = ` 1=1`;
  for (let obj of objArr) {
    str += ` AND ${obj.colName} = '${obj.value}'`;
  }
  return str;
};

const iterate = function (argArr) {
  let str = "";
  for (let arg of argArr) {
    str += `, ${arg}`;
  }
  return str.substring(2);
};

const isValid = function (obj, type, argCnt) {
  if (type === "array") {
    return Array.isArray(obj) && argCnt === obj.length;
  } else if (type === "object") {
    return !Array.isArray(obj) && argCnt === Object.keys(obj).length;
  }
};

module.exports.accounts = {
  //
  login: function (obj, res) {
    if (!isValid(obj, "object", 2)) {
      new Response().badRequest(res);
      return false;
    }
    let sql = `
    SELECT
  	  EMAIL, TEAM
    FROM
    	ACCOUNTS
    WHERE 1=1
      AND (EMAIL = '${obj.EMAIL}' OR ACCOUNT_UUID = '${obj.ACCOUNT_UUID}')
      AND PASSWORD = '${obj.PASSWORD}'
    `;
    query(sql)
      .then((r) => {
        if (r.length == 0) {
          new Response.notFound();
        } else {
          new Response(r).OK(res);
        }
      })
      .catch((err) => {
        console.log(err);
        new Response().internalServerError(res);
      });
  },

  register: function (argArr, res) {
    if (!isValid(argArr, "array", 4)) {
      new Response().badRequest(res);
      return false;
    }
    let sql = `
    INSERT INTO
      ACCOUNTS(
        ACCOUNT_UUID,
        EMAIL,
        PASSWORD,
        AUTH,
        TEAM
      )
      VALUES(
        '${argArr[0]}',
        '${argArr[1]}',
        '${argArr[2]}',
        0,
        '${argArr[3]}'
      )
    `;
    query(sql)
      .then((r) => {
        if (r.affectedRows == 0) {
          new Response().notFound(res);
        } else {
          new Response(r).OK(res);
        }
      })
      .catch((err) => {
        console.log(err);
        new Response().internalServerError(res);
      });
  },

  changePassword: function (obj, res) {
    if (!isValid(obj, "object", 3)) {
      new Response().badRequest(res);
      return false;
    }
    let sql = `
    UPDATE
      ACCOUNTS
    SET
      PASSWORD = '${obj.NEW_PASSWORD}'
    WHERE 1=1
      AND ACCOUNT_UUID = '${obj.ACCOUNT_UUID}'
      AND PASSWORD = '${obj.CUR_PASSWORD}'
    `;
    query(sql)
      .then((r) => {
        if (r.affectedRows == 0) {
          res.send(new Response(404, null, "일치하는 정보 없음"));
        } else {
          res.send(
            new Response(200, r.affectedRows, `${r.affectedRows}건 변경`)
          );
        }
      })
      .catch((err) => {
        console.log(err);
        new Response().internalServerError(res);
      });
  },
};
