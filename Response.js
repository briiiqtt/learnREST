const DB_NAMESPACE = require("./DB_NAMESPACE");

const Response = class {
  constructor(_res, _data) {
    this.res = _res;
    this.data = _data;
  }
  sendResponse() {
    this.res.send({
      data: this.data,
      status: this.status,
      message: this.message,
    });
  }
  OK(msg) {
    this.res.status(200);
    this.status = 200;
    this.message = DB_NAMESPACE.RES_MSG.OK;
    this.sendResponse();
  }
  badRequest(msg) {
    this.res.status(400);
    this.status = 400;
    this.message = DB_NAMESPACE.RES_MSG.BAD_REQUEST;
    this.message += msg === undefined ? "" : `: ${msg}`;
    this.sendResponse();
  }
  notFound(msg) {
    this.res.status(404);
    this.status = 404;
    this.message = DB_NAMESPACE.RES_MSG.NOT_FOUND;
    this.message += msg === undefined ? "" : `: ${msg}`;
    this.sendResponse();
  }
  internalServerError(msg) {
    this.res.status(500);
    this.status = 500;
    this.message = DB_NAMESPACE.RES_MSG.INTERNAL_SERVER_ERROR;
    this.message += msg === undefined ? "" : `: ${msg}`;
    this.sendResponse();
  }
};

module.exports = Response;
