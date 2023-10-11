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
  Compressor: () => Compressor
});
module.exports = __toCommonJS(stdin_exports);
var zlib = __toESM(require("zlib"));
class Compressor {
  static async compressString(input) {
    return new Promise((resolve, reject) => {
      zlib.deflate(input, (err, buffer) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(buffer.toString("base64"));
      });
    });
  }
  static async decompressString(compressed) {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.from(compressed, "base64");
      zlib.inflate(buffer, (err, decompressedBuffer) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(decompressedBuffer.toString());
      });
    });
  }
  // // Using the function
  // decompressString(/* your compressed string */)
  //   .then(original => {
  //     console.log("Original String:", original);
  //   })
  //   .catch(err => {
  //     console.error("Decompression Error:", err);
  //   });
  // const data = "Your string data here";
  // compressString(data)
  //   .then(compressed => {
  //     console.log("Compressed String:", compressed);
  //   })
  //   .catch(err => {
  //     console.error("Compression Error:", err);
  //   });
}
