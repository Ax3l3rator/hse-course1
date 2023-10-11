var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  EncryptedStorage: () => EncryptedStorage
});
module.exports = __toCommonJS(stdin_exports);
var import_electron_store = __toESM(require("electron-store"));
class EncryptedStorage {
  static saveAccessData(data) {
    const {
      access_token,
      refresh_token,
      refresh_token_expires_in,
      expires_in,
      id_token
    } = data;
    this.store.set("access_token", access_token);
    this.store.set("refresh_token", refresh_token);
    this.store.set("id_token", id_token);
    this.store.set("access_expires", expires_in);
    this.store.set("refresh_expires", refresh_token_expires_in);
    this.store.set("access_retrieved", (/* @__PURE__ */ new Date()).getTime());
    this.store.set("refresh_retrieved", (/* @__PURE__ */ new Date()).getTime());
  }
  static getToken(tokenType) {
    const token = this.store.get(`${tokenType}_token`);
    if (!token) {
      throw new Error(`token is not set for ${tokenType}`);
    }
    const expires_in = Number(this.store.get(`${tokenType}_expires`));
    if (!expires_in) {
      throw new Error(`expires_in is not set for ${tokenType}`);
    }
    const retrieved_at = new Date(
      this.store.get(`${tokenType}_retrieved`)
    );
    if (!retrieved_at) {
      throw new Error(`retrieved_at is not set for ${tokenType}`);
    }
    return { token, expires_in, retrieved_at };
  }
}
EncryptedStorage.store = new import_electron_store.default({
  encryptionKey: process.env.scrtk
});
