const { app, BrowserWindow, ipcMain, Menu, MenuItem, dialog } = require('electron')
const path = require('path')

const createWindow = () => {
  let win
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Save Simulation',
          accelerator: 'CmdOrCtrl+S',
          click: async () => {
            const path = await simSaveDialogue()
            win.webContents.send('saveSim', path ?? null)
          },
          id: 'saveSim',
        },
        {
          label: 'Load Simulation',
          accelerator: 'CmdOrCtrl+L',
          click: async () => {
            const path = await simLoadDialogue()
            win.webContents.send('loadSim', path ?? null)
          },
          id: 'loadSim',
        },
        {type: 'separator'},
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit()
          },
          id: 'exit',
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Clear All Points',
          accelerator: 'CmdOrCtrl+Shift+Delete',
          click: () => {
            win.webContents.send('clearAllPoints', null)
          },
          id: 'clearAll',
        },
        {
          label: 'Change Acceleration Due To Gravity',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            win.webContents.send('changeGrav', null)
          },
          id: 'changeGrav',
        },
        {
          label: 'Edit Wall',
          accelerator: 'cmdOrCtrl+W',
          click: () => {
            win.webContents.send('editWall', null)
          },
          id: 'editWall'
        },
        {
          label: 'Edit Selected Point',
          accelerator: 'cmdOrCtrl+E',
          click: () => {
            win.webContents.send('editPoint', null)
          },
          id: 'editPoint'
        },
        {
          label: 'Change Coefficient of Restitution',
          accelerator: 'cmdOrCtrl+Q',
          click: () => {
            win.webContents.send('editCOR', null)
          },
          id: 'editCOR'
        },
        {
          label: 'Change Camera Zoom',
          accelerator: 'cmdOrCtrl+T',
          click: () => {
            win.webContents.send('editZoom', null)
          },
          id: 'editZoom'
        }
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
          },
          id: 'devTools',
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
  ipcMain.on('disableMenuItem', (evt, id) => {
    menu.getMenuItemById(id).enabled = false
  })
  ipcMain.on('enableMenuItem', (evt, id) => {
    menu.getMenuItemById(id).enabled = true
  })

  win.loadFile('.\\app\\index.html')
  Menu.setApplicationMenu(menu)

  win.on('resize', () => {
    var size = win.getSize()
    win.webContents.send('newSize', size)
  })

  win.on('blur', () => {
    win.webContents.send('lostFocus')
  })

  win.on('ready-to-show', () => {
    win.maximize()
    win.show()
    // win.openDevTools()
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
})

async function simSaveDialogue() {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  if(!result.canceled && result.filePaths.length > 0) {
    const selectedDirPath = result.filePaths[0]
    return selectedDirPath
  }
  return null
}

async function simLoadDialogue() {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{name: 'SIMSAVE Files', extensions: '.simsave'}],
  })
  if(!result.canceled && result.filePaths.length > 0) {
    const selectedFilePath = result.filePaths[0]
    return selectedFilePath
  }
  return null
}