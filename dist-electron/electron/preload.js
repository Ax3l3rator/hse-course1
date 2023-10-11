var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("api", {
  auth: () => {
    import_electron.ipcRenderer.invoke("auth");
  },
  rem: () => {
    import_electron.ipcRenderer.invoke("rem");
  }
});
import_electron.ipcRenderer.on("log", (event, data) => {
  console.log(data);
});
