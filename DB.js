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

const init = async function () {
  let promise = new Promise((resolve, reject) => {
    query(
      `SELECT UPPER(TABLE_NAME) "TABLE_NAME" FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${DB_NAMESPACE.CONN.database}';`
    )
      .then((r) => {
        for (let i = 0; i < r.length; i++) {
          query(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${DB_NAMESPACE.CONN.database}' AND TABLE_NAME = '${r[i].TABLE_NAME}'`
          ).then((r2) => {
            let arr = [];
            for (let row2 of r2) {
              arr.push(row2.COLUMN_NAME);
            }
            DATABASE[r[i].TABLE_NAME] = {};
            DATABASE[r[i].TABLE_NAME].columns = arr;
            DATABASE[r[i].TABLE_NAME].tableName = r[i].TABLE_NAME;
            if (i + 1 == r.length) {
              resolve(DATABASE);
            }
          });
        }
      })
      .catch((err) => reject(err));
  });
  return await promise;
};

const DATABASE = {};

const SQL = {
  select() {},
  insert() {},
  update() {},
  delete() {},
};

module.exports = { init, SQL };
