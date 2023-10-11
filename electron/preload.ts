// console.log(process.argv);
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  auth: () => {
    ipcRenderer.invoke('auth');
  },
  rem: () => {
    ipcRenderer.invoke('rem');
  },
});

ipcRenderer.on('log', (event, data) => {
  console.log(data);
});
