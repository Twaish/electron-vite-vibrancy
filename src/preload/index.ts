import { API, Callback } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    $: API
  }
}

type Listener = Callback
type ListenerMap = Record<string, Listener[]>
type EventListeners = Record<string, ListenerMap>

const eventListeners: EventListeners = {}
const eventHandlers = {
  on: (event: string, idOrCallback: string | Listener, maybeCallback: Listener) => {
    const id = typeof idOrCallback === 'function' ? '_' : idOrCallback
    const callback = typeof idOrCallback === 'function' ? idOrCallback : maybeCallback

    eventListeners[event] ??= {}
    eventListeners[event][id] ??= []
    eventListeners[event][id].push(callback)

    if (!ipcRenderer.eventNames().includes(event)) {
      ipcRenderer.on(event, (_, ...args) => {
        Object.values(eventListeners[event]).forEach((entry) => {
          entry.forEach((listener) => listener(...args))
        })
      })
    }

    return () => eventHandlers.off(event, id)
  },
  off: (event: string, id: string = '_') => {
    delete eventListeners[event][id]
  },
}

const api = {
  run: (...args) => ipcRenderer.invoke('run', ...args),
  ...eventHandlers,
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('$', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.$ = api
}
