import { ipcMain } from 'electron'
import { ActionResource, Actions, Tools } from '.'
import { Callback } from '@shared/types'

export default class ActionManager {
  private actions: Actions = {}
  // @ts-ignore
  private tools: Tools = {}
  private actionResources: ActionResource[] = []
  constructor() {
    ipcMain.handle('run', async (_, action, ...args) => await this.actions[action]?.(...args))
  }
  addActionHandler(event: string, callback: Callback) {
    ipcMain.handle(event, async (_, ...args) => callback(...args))
    return this
  }
  addActions(actionResources: ActionResource[]) {
    this.actionResources.push(...actionResources)
    return this
  }
  addTools(tools: Tools) {
    this.tools = { ...this.tools, ...tools }
    return this
  }

  finalize() {
    this.actions = {}
    const promises = this.actionResources.map((actionResource) => {
      try {
        const actions = actionResource(this.tools)
        Object.assign(this.actions, actions)
      } catch (e) {
        console.error(e)
      }
    })
    return Promise.all(promises)
  }
}
