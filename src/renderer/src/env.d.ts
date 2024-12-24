/// <reference types="vite/client" />
import { API } from '@shared/types'

declare global {
  var $: API
}
