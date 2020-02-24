const electron = require('electron');
const youtubedl = require('youtube-dl');
const fs = require('fs');
const template = require('./menu');
const path = require('path');

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});


const { app, BrowserWindow, dialog, ipcMain, Menu, nativeImage } = electron;

const menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);

let win;


function createWindow () {
    win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  win.setIcon(path.join(__dirname, '/assets/images/downloader-icon.ico'))

  win.webContents.openDevTools();

  win.loadFile('index.html')
}

ipcMain.on('download-video', async (event, args) => {
    try {
      const result = await dialog.showOpenDialog(win, {
        properties: ['openDirectory']
      })
      if(!result.filePaths.length) {
        throw new Error('Please select a directory');
      }
      const [filePath] = result.filePaths;

      const video = youtubedl(args.webpage_url,
        ['--format=18'],
        { cwd: __dirname })

      // Will be called when the download starts.
      let fileSize = 0;
      video.on('info', info => {
        fileSize = info.size;
      })
      // Getting download progress
      let progress = 0;
      video.on('data', chunk => {
        progress += chunk.length;
        if(fileSize) {
        let percent = (progress / fileSize * 100).toFixed(2);
        win.webContents.send('update-percentage', percent)
        }
      })
      // Download completed
      video.on('end', () => {
        win.webContents.send('download-completed')
      })
      const downloadLocation = fs.createWriteStream(`${filePath}/${args._filename}`)
      video.pipe(downloadLocation)
    } catch (err) {
      win.webContents.send('directory-not-selected');
    }
})

app.on('ready', createWindow)
