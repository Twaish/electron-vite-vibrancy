import { BrowserWindow } from 'electron'
import ActionManager from './ActionManager'
import ElectronWindow from './ElectronWindow'

export type Tools = {
  send: (stream: string, ...args: any[]) => any
  ElectronWindow: ElectronWindow
  ActionManager: ActionManager
  window: BrowserWindow
}
export type Actions = Record<string, Function>
export type ActionResource = (tools: Tools) => Actions
