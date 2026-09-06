const { app, BrowserWindow, ipcMain, shell, session } = require('electron');
const dgram = require('node:dgram');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const path = require('node:path');
const execFileAsync = promisify(execFile);

const UDP_HOST = '127.0.0.1';
const UDP_PORT = 4242;
const udp = dgram.createSocket('udp4');
const smokeTest = process.argv.includes('--smoke-test');
let udpUsed = false;
let hasPose = false;
let targetPose = [0, 0, 0, 0, 0, 0];
let outputPose = [0, 0, 0, 0, 0, 0];
let lastPoseAt = 0;
let lastOutputAt = Date.now();

function sendUdpPose(pose) {
  const packet = Buffer.allocUnsafe(48);
  pose.forEach((value, index) => packet.writeDoubleLE(Math.max(-500, Math.min(500, value)), index * 8));
  udpUsed = true;
  udp.send(packet, UDP_PORT, UDP_HOST);
}

// Kamera 30/60 FPS olsa da oyuna 120 Hz yumusak bir akis saglar.
const outputTimer = setInterval(() => {
  if (!hasPose) return;
  const now = Date.now();
  const elapsed = Math.min(0.05, Math.max(0.001, (now - lastOutputAt) / 1000));
  lastOutputAt = now;
  if (now - lastPoseAt > 500) targetPose = [0, 0, 0, 0, 0, 0];
  const blend = 1 - Math.exp(-elapsed / 0.028);
  outputPose = outputPose.map((value, index) => value + (targetPose[index] - value) * blend);
  sendUdpPose(outputPose);
}, 1000 / 120);
outputTimer.unref();

async function processIsRunning(imageName) {
  try {
    const { stdout } = await execFileAsync('tasklist.exe', ['/FI', `IMAGENAME eq ${imageName}`, '/NH', '/FO', 'CSV'], {
      windowsHide: true,
      encoding: 'utf8',
    });
    return stdout.toLowerCase().includes(`\"${imageName.toLowerCase()}\"`);
  } catch {
    return false;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: '#0d1117',
    title: 'TruckLook',
    show: !smokeTest,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    win.loadURL(devUrl);
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  if (smokeTest) {
    win.webContents.once('did-finish-load', () => setTimeout(() => app.quit(), 250));
  }
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === 'media');
  });

  ipcMain.on('pose:send', (_event, pose) => {
    if (!Array.isArray(pose) || pose.length !== 6 || pose.some((value) => !Number.isFinite(value))) return;
    targetPose = pose.map((value) => Math.max(-500, Math.min(500, value)));
    lastPoseAt = Date.now();
    if (!hasPose) outputPose = [...targetPose];
    hasPose = true;
  });

  ipcMain.handle('app:version', () => app.getVersion());
  ipcMain.handle('system:status', async () => ({
    openTrack: await processIsRunning('opentrack.exe'),
    ets2: await processIsRunning('eurotrucks2.exe'),
  }));
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  clearInterval(outputTimer);
  if (udpUsed) udp.close();
});
