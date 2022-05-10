const res = require("express/lib/response");
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "aig_server_demo",
});

const Response = class {
  constructor(_status, _data, _message) {
    this.status = _status;
    this.data = _data;
    this.message = _message;
  }
};

const query = async function (sql) {
  try {
    let promise = new Promise((resolve, reject) => {
      connection.query(sql, (err, rows, fields) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
    let rs = await promise;
    return rs;
  } catch (err) {
    console.log(err);
    return null;
  }
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
      res.status(400);
      res.send(new Response(400, null, "잘못된 요청"));
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
          res.status(404);
          res.send(new Response(404, null, "일치하는 정보 없음"));
        } else {
          res.status(200);
          res.send(new Response(200, r, null));
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.send(new Response(500, null, "500"));
      });
  },

  register: function (argArr, res) {
    if (!isValid(argArr, "array", 4)) {
      res.status(400);
      res.send(new Response(400, null, "잘못된 요청"));
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
          res.status(404);
          res.send(new Response(404, null, "일치하는 정보 없음"));
        } else {
          res.status(200);
          res.send(
            new Response(200, r.affectedRows, `${r.affectedRows}건 등록`)
          );
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.send(new Response(500, null, "500"));
      });
  },

  changePassword: function (obj, res) {
    if (!isValid(obj, "object", 3)) {
      res.status(400);
      res.send(new Response(400, null, "잘못된 요청"));
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
        res.send(new Response(500, null, "500"));
      });
  },
};
