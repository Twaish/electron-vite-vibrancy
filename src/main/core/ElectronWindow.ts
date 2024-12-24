import { is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, shell, app } from 'electron'
import icon from '../../../resources/icon.png?asset'
import path from 'path'
import vibrancy from '../../../build/Release/vibrancy.node'
import pkg from '../../../package.json'

export default class ElectronWindow {
  private window: BrowserWindow
  constructor() {
    const window = new BrowserWindow({
      title: pkg.productName,
      width: 1145,
      height: 750,
      show: false,
      icon: icon,

      frame: false,
      transparent: true,
      backgroundColor: '#00000000',

      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        sandbox: false,
      },
    })
    window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
    window.webContents.on('will-navigate', (event, url) => {
      console.log(`Navigation attempted to: ${url}`)
      // Optionally, prevent the navigation:
      event.preventDefault()
    })
    this.window = window
  }
  getWindowHandle = () => {
    const handle = this.window.getNativeWindowHandle()
    const windowHandle = handle.readBigInt64LE(0)
    return Number(windowHandle)
  }
  enableBlur = () => {
    vibrancy.setBlurBehindEffect(this.window.getNativeWindowHandle())
  }
  disableBlur = () => {
    vibrancy.disableBlurBehindEffect(this.window.getNativeWindowHandle())
  }
  setShadow = (enabled: boolean) => {
    vibrancy.setShadow(this.window.getNativeWindowHandle(), enabled)
  }
  getBrowserWindow() {
    return this.window
  }

  showWindow() {
    const { window } = this
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      window.loadFile(path.join(__dirname, '../renderer/index.html'))
    }
    window.show()
    window.maximize()
    // @ts-ignore
    window.openDevTools()
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Default open or close DevTools by F12 in development
// and ignore CommandOrControl + R in production.
// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
app.on('browser-window-created', (_, window) => {
  optimizer.watchWindowShortcuts(window)
})
