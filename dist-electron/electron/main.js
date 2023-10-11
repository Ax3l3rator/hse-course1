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
var import_HSEAuthService = require("./utils/HSEAuthService");
var jwt = __toESM(require("jsonwebtoken"));
var import_Store = require("./utils/Store");
try {
  console.log(import_Store.EncryptedStorage.getToken("refresh"));
  console.log(process.env.scrtk);
} catch (_) {
}
let window;
function createWindow() {
  window = new import_electron.BrowserWindow({
    width: 1280,
    height: 720,
    minHeight: 720,
    minWidth: 1280,
    webPreferences: {
      preload: import_path.default.join(__dirname, "preload.js")
    },
    icon: "icon.png",
    center: true,
    show: false
  });
  window.setMenu(null);
  window.center();
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
  window.webContents.on("did-finish-load", () => {
    window.show();
  });
}
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    import_electron.app.setAsDefaultProtocolClient("ruz-app-fiddle", process.execPath, [
      import_path.default.resolve(process.argv[1])
    ]);
  }
} else {
  import_electron.app.setAsDefaultProtocolClient("ruz-app-fiddle");
}
const gotTheLock = import_electron.app.requestSingleInstanceLock();
if (!gotTheLock) {
  import_electron.app.exit();
}
import_electron.app.whenReady().then(async () => {
  createWindow();
});
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin")
    import_electron.app.exit();
});
import_electron.ipcMain.handle("auth", () => {
  console.log("here");
  const authWindow = new import_electron.BrowserWindow({
    minimizable: false,
    resizable: false,
    parent: window,
    modal: true,
    frame: true,
    thickFrame: true,
    useContentSize: true,
    show: false
  });
  authWindow.setMenu(null);
  authWindow.webContents.loadURL(
    "https://auth.hse.ru/adfs/oauth2/authorize?response_type=code&client_id=5adda899-e75d-46d9-90d9-38380bdf060a&redirect_uri=ruz-app-fiddle://auth.hse.ru/adfs/oauth2/callback"
  );
  authWindow.center();
  authWindow.webContents.on("did-finish-load", () => {
    authWindow.show();
  });
  authWindow.webContents.on("did-redirect-navigation", async (event) => {
    const code = new URL(event.url).searchParams.get("code");
    if (code) {
      const accessData = await import_HSEAuthService.HSEAuthService.requestAccessByCode(code);
      import_Store.EncryptedStorage.saveAccessData(accessData);
      const decoded = jwt.decode(accessData.id_token, {
        complete: true
      });
      window.webContents.send("log", decoded);
      authWindow.close();
    }
  });
});
import_electron.ipcMain.handle("rem", async () => {
});
