var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_electron = require("electron");
var import_path = __toESM(require("path"));
let window;
function createWindow() {
  window = new import_electron.BrowserWindow({
    minHeight: 720,
    minWidth: 1280,
    webPreferences: {
      webSecurity: false,
      preload: import_path.default.join(__dirname, "preload.ts")
    },
    icon: "icon.png"
  });
  window.setMenu(null);
  if (process.env.DEV_URL) {
    window.loadURL(process.env.DEV_URL);
    window.webContents.on("before-input-event", (_, input) => {
      if (input.type === "keyDown" && input.key === "F12") {
        window.webContents.openDevTools({ mode: "detach" });
      }
    });
  } else {
    window.loadFile(import_path.default.join(__dirname, "../../.output/public/index.html"));
  }
  if (process.argv.slice(1).length) {
  }
}
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    import_electron.app.setAsDefaultProtocolClient("appx-fiddle", process.execPath, [
      import_path.default.resolve(process.argv[1])
    ]);
  }
} else {
  import_electron.app.setAsDefaultProtocolClient("appx-fiddle");
}
const gotTheLock = import_electron.app.requestSingleInstanceLock();
if (!gotTheLock) {
  import_electron.app.exit();
} else {
  import_electron.app.on("second-instance", (event, commandLine, workingDirectory) => {
    if (window) {
      if (window.isMinimized()) {
        window.restore();
      }
      window.focus();
    }
    let v = process.argv.slice(1);
  });
}
import_electron.app.whenReady().then(() => {
  createWindow();
});
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin")
    import_electron.app.exit();
});
