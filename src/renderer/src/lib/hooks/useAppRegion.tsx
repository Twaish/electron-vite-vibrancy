import { useEffect, useRef } from 'react'

export const useAppRegion = <T extends HTMLElement>() => {
  const appRegionRef = useRef<T>(null)
  // Mouse
  let LEFTCLICK = false
  let DOUBLECLICK = false
  let DRAGMAXIMIZE = false
  let CLICKPOSITION = { x: 0, y: 0 }
  let LASTCLICK = 0

  // Browser
  let MAXIMIZED = false
  let WASMAXIMIZED = false
  let POSITION = { x: 0, y: 0 }

  const w = 1145
  const h = 750
  const threshold = 500

  const updatePosition = async () => {
    const [x, y] = await $.run('window:getPosition')
    POSITION = { x, y: y < 0 ? 0 : y }
  }
  updatePosition()

  const onmousedown = async (e: MouseEvent) => {
    if (e.target !== appRegionRef.current) {
      return
    }
    LEFTCLICK = e.button === 0
    CLICKPOSITION = { x: e.screenX, y: e.screenY }

    if (LEFTCLICK) {
      const current = performance.now()
      const dt = current - LASTCLICK

      if (dt <= threshold) {
        LASTCLICK = 0
        DOUBLECLICK = true
        $.run('window:toggle')
      } else {
        LASTCLICK = current
      }
    }

    MAXIMIZED = await $.run('window:isMaximized')
    updatePosition()
  }
  const onmousemove = (e: MouseEvent) => {
    if (LEFTCLICK && !DOUBLECLICK) {
      const { screenX, screenY } = e
      if (MAXIMIZED) {
        $.run('window:toggle')
        $.run('window:setSize', w, h)
        MAXIMIZED = false
        WASMAXIMIZED = true
      }

      LASTCLICK = 0
      DRAGMAXIMIZE = screenY <= 0

      let { x, y } = CLICKPOSITION
      if (WASMAXIMIZED) {
        x = screenX + (-x * w) / window.screen.width
      } else {
        x = screenX + -x + POSITION.x
      }
      y = screenY + POSITION.y - y
      $.run('window:setPosition', Math.floor(x), Math.floor(y))
    }
  }
  const onmouseup = () => {
    updatePosition()
    LEFTCLICK = DOUBLECLICK = WASMAXIMIZED = false

    if (DRAGMAXIMIZE && !MAXIMIZED) {
      DRAGMAXIMIZE = false
      MAXIMIZED = true
      $.run('window:toggle')
    }
  }

  useEffect(() => {
    if (!appRegionRef.current) {
      return
    }
    appRegionRef.current.addEventListener('mousedown', onmousedown)
    window.addEventListener('mousemove', onmousemove)
    window.addEventListener('mouseup', onmouseup)
    return () => {
      appRegionRef.current?.removeEventListener('mousedown', onmousedown)
      window.removeEventListener('mousemove', onmousemove)
      window.removeEventListener('mouseup', onmouseup)
    }
  }, [appRegionRef])

  return appRegionRef
}
