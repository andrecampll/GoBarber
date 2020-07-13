"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: 'andrevictor50@gmail.com',
      // configured email from ses
      name: 'André da Rocketseat'
    }
  }
};
exports.default = _default;