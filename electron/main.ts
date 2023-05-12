import { app, BrowserWindow, shell, dialog } from 'electron';
import path from 'path';

let window: BrowserWindow;

function createWindow() {
  window = new BrowserWindow({
    minHeight: 720,
    minWidth: 1280,
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, 'preload.ts'),
    },
    icon: 'icon.png',
  });

  window.setMenu(null);

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
  if (process.argv.slice(1).length) {
    // link in  process.argv.slice(1)
  }
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('appx-fiddle', process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient('appx-fiddle');
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.exit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (window) {
      if (window.isMinimized()) {
        window.restore();
      }
      window.focus();
    }
    let v = process.argv.slice(1);
    // link in commandLine[commandLine.length - 1].slice(0, -1)}
  });
}

app.whenReady().then(() => {
  createWindow();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.exit();
});
