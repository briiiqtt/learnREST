const _NAMESPACE = require("./_NAMESPACE.JS");

const Response = class {
  constructor(_res, _data) {
    this.res = _res;
    this.data = _data;
  }
  sendResponse() {
    this.res.send({
      data: this.data,
      code: this.code,
      message: this.message,
    });
  }
  OK(msg) {
    this.res.status(200);
    this.code = 0;
    this.message = _NAMESPACE.RES_MSG.OK;
    this.sendResponse();
  }
  badRequest(msg) {
    this.res.status(400);
    this.code = 1;
    this.message = _NAMESPACE.RES_MSG.BAD_REQUEST;
    this.message += msg === undefined ? "" : `: ${msg}`;
    this.sendResponse();
  }
  notFound(msg) {
    this.res.status(404);
    this.code = 2;
    this.message = _NAMESPACE.RES_MSG.NOT_FOUND;
    this.message += msg === undefined ? "" : `: ${msg}`;
    this.sendResponse();
  }
  methodNotAllowed(msg) {
    this.res.status(405);
    this.code = 3;
    this.message = _NAMESPACE.RES_MSG.METHOD_NOT_ALLOWED;
    this.message += msg === undefined ? "" : `: ${msg}`;
    this.sendResponse();
  }
  internalServerError(msg) {
    this.res.status(500);
    this.code = 11;
    this.message = _NAMESPACE.RES_MSG.INTERNAL_SERVER_ERROR;
    this.message += msg === undefined ? "" : `: ${msg}`;
    this.sendResponse();
  }
};

module.exports = Response;
