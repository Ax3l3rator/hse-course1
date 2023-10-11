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
  HSEService: () => HSEService,
  config: () => config
});
module.exports = __toCommonJS(stdin_exports);
var import_electron = require("electron");
const config = {
  client_id: "5adda899-e75d-46d9-90d9-38380bdf060a",
  redirect_uri: "ruz-app-fiddle://auth.hse.ru/adfs/oauth2/callback"
};
class HSEService {
  static async requestAccessByCode(code) {
    return new Promise((resolve, reject) => {
      const request = import_electron.net.request({
        url: "https://auth.hse.ru/adfs/oauth2/token/",
        method: "POST"
      });
      const params = {
        code,
        client_id: "5adda899-e75d-46d9-90d9-38380bdf060a",
        redirect_uri: "ruz-app-fiddle://auth.hse.ru/adfs/oauth2/callback",
        grant_type: "authorization_code"
      };
      const urlEncodedParams = new URLSearchParams(params).toString();
      request.on("response", (response) => {
        const data = [];
        response.on("data", (chunk) => {
          data.push(chunk);
        });
        response.on("end", () => {
          let accessData = null;
          accessData = JSON.parse(Buffer.concat(data).toString());
          if (accessData) {
            resolve(accessData);
          } else {
            reject(new Error("Response data has wrong format"));
          }
        });
        response.on("error", (error) => {
          console.error(error);
          reject(error);
        });
      });
      request.on("error", (error) => {
        console.error(error);
        reject(error);
      });
      request.write(urlEncodedParams);
      request.end();
    });
  }
}
