const electron = require('electron');

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});


const { app, BrowserWindow, dialog, ipcMain } = electron;

let win;

function createWindow () {
  // Create the browser window.
    win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

ipcMain.on('download-video', async (event, args) => {
    try {
      const result = await dialog.showOpenDialog(win, {
        properties: ['openDirectory']
      })
      console.log('selected directories', result.filePaths)
    } catch (err) {
      console.error(err)
    }
})

app.on('ready', createWindow)
