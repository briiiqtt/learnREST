const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "aig_server_demo",
});

const DB_NAMESPACE = require("./DB_NAMESPACE");
const Response = require("./Response");

const query = async function (sql) {
  let promise = new Promise((resolve, reject) => {
    connection.query(sql, (err, rows, fields) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
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

const DB = {
  accounts: {
    login: function (argObj, res) {
      if (!isValid(argObj, "object", 2)) {
        new Response(res).badRequest(DB_NAMESPACE.RES_MSG.IS_NOT_VALID);
        return false;
      }
      if (!(argObj.ACCOUNT_UUID && argObj.PASSWORD)) {
        new Response(res).badRequest(DB_NAMESPACE.RES_MSG.INSUFFICIENT_VALUE);
        return false;
      }
      let sql = `
    SELECT
  	  EMAIL, TEAM
    FROM
    	ACCOUNTS
    WHERE 1=1
      AND (EMAIL = '${argObj.EMAIL}' OR ACCOUNT_UUID = '${argObj.ACCOUNT_UUID}')
      AND PASSWORD = '${argObj.PASSWORD}'
    `;
      query(sql)
        .then((r) => {
          if (r.length == 0) {
            new Response(res).notFound();
          } else {
            new Response(res, r).OK();
          }
        })
        .catch((err) => {
          console.log(err);
          new Response(res).internalServerError();
        });
    },

    register: function (argArr, res) {
      if (!isValid(argArr, "array", 4)) {
        new Response(res).badRequest();
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
            new Response(res).notFound();
          } else {
            new Response(res, r).OK();
          }
        })
        .catch((err) => {
          console.log(err);
          new Response(res).internalServerError();
        });
    },

    changePassword: function (argObj, res) {
      if (!isValid(argObj, "object", 3)) {
        new Response(res).badRequest();
        return false;
      }
      let sql = `
    UPDATE
      ACCOUNTS
    SET
      PASSWORD = '${argObj.NEW_PASSWORD}'
    WHERE 1=1
      AND ACCOUNT_UUID = '${argObj.ACCOUNT_UUID}'
      AND PASSWORD = '${argObj.CUR_PASSWORD}'
    `;
      query(sql)
        .then((r) => {
          if (r.affectedRows == 0) {
            new Response(res).notFound();
          } else {
            new Response(res, r).OK();
          }
        })
        .catch((err) => {
          console.log(err);
          new Response(res).internalServerError(res);
        });
    },
  },
};

module.exports = DB;
