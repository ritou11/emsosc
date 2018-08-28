const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const net = require('net');

let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadURL(isDev ? 'http://localhost:3000/' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => { mainWindow = null; });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (!mainWindow) createWindow();
});

const server = net.createServer();
let serverState = false;
const clients = [];

ipcMain.on('toggle-listening', async (event, listenPort) => {
  if (serverState) {
    clients.forEach((c) => { c.destroy(); });
    clients.forEach(() => { clients.pop(); });
    server.close();
    server.removeAllListeners();

    event.sender.send('toggle-listening', 'IDLE');
    serverState = false;

    console.log('server off');
  } else {
    server.on('connection', (socket) => {
      socket.setEncoding('utf8');
      socket.on('data', (data) => {
        event.sender.send('data', data);
      });
      socket.on('close', () => {
        console.log('Closed');
      });
      clients.push(socket);
    });
    server.listen(listenPort);
    event.sender.send('toggle-listening', 'LISTENING');
    serverState = true;

    console.log('server on');
  }
});
