const DB_NAMESPACE = require("./DB_NAMESPACE");
const mysql = require("mysql");
const connection = mysql.createConnection(DB_NAMESPACE.CONN);

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

const DB = {
  ACCOUNTS: {
    // COLUMNS: ["ACCOUNT_UUID", "_IS_DELETED"],
    // select() {},
    // insert() {},
    // update() {},
    // delete() {},
  },
};

module.exports = DB;
