const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron')
const path = require('path')

const createWindow = () => {
  let win
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit()
          },
        },
      ],
    },
    {
      label: 'Dev',
      submenu: [
        {
          label: 'Dev Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => {
            win.webContents.openDevTools({
              mode: 'undocked'
            })
          }
        },
      ]
    }
  ]
  
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    webPreferences: {
      devTools: true,
      contextIsolation: false,
      nodeIntegration: true,
    },
  })

  const menu = Menu.buildFromTemplate(template)

  win.loadFile('.\\app\\index.html')
  Menu.setApplicationMenu(menu)

  win.on('resize', () => {
    var size = win.getSize()
    win.webContents.send('newSize', size)
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
})
