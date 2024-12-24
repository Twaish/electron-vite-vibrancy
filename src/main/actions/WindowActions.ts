import { ActionResource, Tools } from '@/core'

const actions: ActionResource = ({ window, ElectronWindow }: Tools) => {
  ElectronWindow.enableBlur()
  ElectronWindow.setShadow(true)
  return {
    'window:setTitle': (title: string) => window.setTitle(title),
    'window:getTitle': () => window.getTitle(),
    'window:close': () => window.close(),

    'window:toggle': () => (window.isMaximized() ? window.unmaximize() : window.maximize()),
    'window:minimize': () => window.minimize(),
    'window:isMaximized': () => window.isMaximized(),

    'window:setSize': (width: number, height: number) => window.setSize(width, height),
    'window:setPosition': (x: number, y: number) => window.setPosition(x, y < 0 ? 0 : y),
    'window:getPosition': () => window.getPosition(),

    'window:enableBlur': ElectronWindow.enableBlur,
    'window:disableBlur': ElectronWindow.disableBlur,
  }
}

export default actions
