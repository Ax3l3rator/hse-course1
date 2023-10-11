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
  KeyTarVault: () => KeyTarVault
});
module.exports = __toCommonJS(stdin_exports);
var jwt = __toESM(require("jsonwebtoken"));
var os = __toESM(require("os"));
var import_Compressor = require("./Compressor");
class KeyTarVault {
  static async storeAccessData(data) {
    console.log(data);
    console.log("Anime", data.access_token, data.access_token.length);
    const compressed_acc = await import_Compressor.Compressor.compressString(data.access_token);
    console.log(compressed_acc.length);
    await keytar.setPassword(this.serviceName, "access_token", compressed_acc);
    const compressed_token = await import_Compressor.Compressor.compressString(
      data.refresh_token
    );
    await keytar.setPassword(
      this.serviceName,
      "access_expires_in",
      data.expires_in.toString()
    );
    await keytar.setPassword(
      this.serviceName,
      "refresh_expires_in",
      data.refresh_token_expires_in.toString()
    );
    await keytar.setPassword(
      this.serviceName,
      "access_retrieved_at",
      (/* @__PURE__ */ new Date()).getTime().toString()
    );
    console.log(compressed_token.length);
    console.log(compressed_token);
    console.log(data.refresh_token);
    console.log(jwt.decode(data.refresh_token));
    await keytar.setPassword(
      this.serviceName,
      "refresh_token",
      "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
    ).catch((err) => {
      console.log(err);
    });
    console.log("Anime", data.expires_in, data.expires_in);
    await keytar.setPassword(
      this.serviceName,
      "refresh_retrieved_at",
      (/* @__PURE__ */ new Date()).getTime().toString()
    );
    await keytar.setPassword(this.serviceName, "id_token", data.id_token);
  }
  static async retrieveToken(token_type) {
    const token = await keytar.getPassword(
      this.serviceName,
      `${token_type}_token`
    );
    const expires_in = Number(
      await keytar.getPassword(this.serviceName, `${token_type}_expires_in`)
    );
    const expires_inStr = await keytar.getPassword(
      this.serviceName,
      `${token_type}_expires_in`
    );
    const retrieved_at = new Date(
      Number(
        await keytar.getPassword(this.serviceName, `${token_type}_retrieved_at`)
      )
    );
    console.log(token, expires_in, retrieved_at, expires_inStr);
    if (!token || !expires_in || !retrieved_at) {
      throw new Error("Some of token information is not obtainable");
    } else {
      return { token, expires_in, retrieved_at };
    }
  }
  static async retrieveIdToken() {
    const id_token = await keytar.getPassword(this.serviceName, "id_token");
    if (!id_token) {
      throw new Error("id_token is not set");
    } else {
      return id_token;
    }
  }
  static async removeTokenData() {
    await keytar.deletePassword(this.serviceName, "access_token");
    await keytar.deletePassword(this.serviceName, "access_expires_in");
    await keytar.deletePassword(this.serviceName, "access_retrieved_at");
    await keytar.deletePassword(this.serviceName, "refresh_token");
    await keytar.deletePassword(this.serviceName, "refresh_expires_in");
    await keytar.deletePassword(this.serviceName, "refresh_retrieved_at");
    await keytar.deletePassword(this.serviceName, "id_token");
  }
}
KeyTarVault.serviceName = `${os.userInfo().username}-HseAppX321`;
