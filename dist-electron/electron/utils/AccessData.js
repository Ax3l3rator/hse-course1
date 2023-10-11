var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  isAccessData: () => isAccessData
});
module.exports = __toCommonJS(stdin_exports);
const isAccessData = (object) => {
  const pattern = {
    access_token: "dummy",
    token_type: "dummy",
    expires_in: 1,
    resource: "dummy",
    refresh_token: "dummy",
    refresh_token_expires_in: 1,
    id_token: "dummy"
  };
  for (const param in pattern) {
    if (!(param in object)) {
      return false;
    }
  }
  return true;
};