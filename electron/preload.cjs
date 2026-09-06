const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('truckLook', {
  sendPose: (pose) => ipcRenderer.send('pose:send', pose),
  getVersion: () => ipcRenderer.invoke('app:version'),
  getSystemStatus: () => ipcRenderer.invoke('system:status'),
});
