import { BrowserWindow, app } from 'electron'

import ElectronWindow from './core/ElectronWindow'
import ActionManager from './core/ActionManager'
import Actions from './actions'

app.whenReady().then(async () => {
  const electronWindow = new ElectronWindow()
  const window = electronWindow.getBrowserWindow()
  const send = (stream: string, ...args: any[]) => {
    return window.webContents.send(stream, ...args)
  }

  const actionManager = new ActionManager()
  actionManager.addActions(Actions).addTools({
    send: send,
    ElectronWindow: electronWindow,
    ActionManager: actionManager,
    window: window,
  })
  await actionManager.finalize()

  electronWindow.showWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      new ElectronWindow()
    }
  })
})
