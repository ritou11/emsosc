const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const net = require('net');
const _ = require('lodash');

let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 800, height: 800 });
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

let dataBuffer = [];
let timer;

ipcMain.on('toggle-listening', async (event, listenPort) => {
  if (serverState) {
    clients.forEach((c) => { c.destroy(); });
    clients.forEach(() => { clients.pop(); });
    server.close();
    server.removeAllListeners();
    clearInterval(timer);

    event.sender.send('toggle-listening', 'IDLE');
    serverState = false;

    console.log('server off');
  } else {
    server.on('connection', (socket) => {
      socket.setEncoding('utf8');
      socket.on('data', (data) => {
        const m = data.split(' ');
        // console.log(m);
        if (m && m.length > 1
          && _.isNumber(parseFloat(m[0]))
          && _.isNumber(parseFloat(m[1]))) {
          dataBuffer.push({
            x: parseFloat(m[0]),
            y: parseFloat(m[1]),
          });
        } else {
          console.log(data);
        }
      });
      clients.push(socket);
    });
    server.listen(listenPort);
    event.sender.send('toggle-listening', 'LISTENING');
    serverState = true;
    timer = setInterval(() => {
      if (dataBuffer.length > 0) {
        event.sender.send('data', dataBuffer);
        dataBuffer = [];
      }
    }, 500);

    console.log('server on');
  }
});
