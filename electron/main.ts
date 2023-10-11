import {
  app,
  BrowserWindow,
  shell,
  dialog,
  net,
  ipcMain,
  BrowserView,
  ipcRenderer,
} from 'electron';
import path from 'path';
import { AccessData } from './utils/AccessData';
import { HSEAuthService } from './utils/HSEAuthService';
import * as jwt from 'jsonwebtoken';
import * as os from 'os';
import { Compressor } from './utils/Compressor';
import { EncryptedStorage } from './utils/Store';
try {
  console.log(EncryptedStorage.getToken('refresh'));
  console.log(process.env.scrtk);
} catch (_) {}

let window: BrowserWindow;
function createWindow() {
  window = new BrowserWindow({
    width: 1280,
    height: 720,
    minHeight: 720,
    minWidth: 1280,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: 'icon.png',
    center: true,
    show: false,
  });

  window.setMenu(null);
  window.center();
  if (process.env.DEV_URL) {
    window.loadURL(process.env.DEV_URL);
    window.webContents.on('before-input-event', (_, input) => {
      if (input.type === 'keyDown' && input.key === 'F12') {
        window.webContents.openDevTools({ mode: 'detach' });
      }
    });
  } else {
    window.loadFile(path.join(__dirname, '../../.output/public/index.html'));
  }
  window.webContents.on('did-finish-load', () => {
    window.show();
  });
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('ruz-app-fiddle', process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient('ruz-app-fiddle');
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.exit();
}

app.whenReady().then(async () => {
  // console.log(
  //   await KeyTarVault.retrieveToken('access').catch((err) => {
  //     console.log(err);
  //   })
  // );
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.exit();
});

ipcMain.handle('auth', () => {
  console.log('here');
  const authWindow = new BrowserWindow({
    minimizable: false,
    resizable: false,
    parent: window,
    modal: true,
    frame: true,
    thickFrame: true,
    useContentSize: true,
    show: false,
  });
  authWindow.setMenu(null);
  authWindow.webContents.loadURL(
    'https://auth.hse.ru/adfs/oauth2/authorize?response_type=code&client_id=5adda899-e75d-46d9-90d9-38380bdf060a&redirect_uri=ruz-app-fiddle://auth.hse.ru/adfs/oauth2/callback'
  );
  authWindow.center();
  authWindow.webContents.on('did-finish-load', () => {
    authWindow.show();
  });
  authWindow.webContents.on('did-redirect-navigation', async (event) => {
    const code = new URL(event.url).searchParams.get('code');
    if (code) {
      const accessData = await HSEAuthService.requestAccessByCode(code);
      EncryptedStorage.saveAccessData(accessData);
      // await KeyTarVault.storeAccessData(accessData).catch((e) => {
      //   window.webContents.send('log', e);
      // });
      const decoded = jwt.decode((accessData as AccessData).id_token, {
        complete: true,
      });
      window.webContents.send('log', decoded);
      authWindow.close();
    }
  });
});

ipcMain.handle('rem', async () => {
  // await KeyTarVault.removeTokenData();
});
