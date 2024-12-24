import { useEffect, useRef } from 'react'
import styles from './WindowControls.module.css'

export const WindowControls = (): JSX.Element => {
  const minimizeButtonRef = useRef<HTMLDivElement>(null)
  const maximizeButtonRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const minimizeButton = minimizeButtonRef.current!
    const maximizeButton = maximizeButtonRef.current!
    const closeButton = closeButtonRef.current!

    const minimizeHandler = () => {
      $.run('window:minimize')
    }
    const maximizeHandler = () => {
      $.run('window:toggle')
    }
    const closeHandler = () => {
      $.run('window:close')
    }

    minimizeButton.addEventListener('click', minimizeHandler)
    maximizeButton.addEventListener('click', maximizeHandler)
    closeButton.addEventListener('click', closeHandler)

    return () => {
      minimizeButton.removeEventListener('click', minimizeHandler)
      maximizeButton.removeEventListener('click', maximizeHandler)
      closeButton.removeEventListener('click', closeHandler)
    }
  }, [])

  return (
    <div className={styles.controls}>
      <div className={styles.button} ref={minimizeButtonRef}>
        <svg
          fill="currentColor"
          stroke="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M400 288h-352c-17.69 0-32-14.32-32-32.01s14.31-31.99 32-31.99h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z"></path>
        </svg>
      </div>
      <div className={styles.button} ref={maximizeButtonRef}>
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="18" height="18" x="2" y="3" rx="2" ry="2"></rect>
        </svg>
      </div>
      <div className={styles.button} ref={closeButtonRef}>
        <svg fill="currentColor" viewBox="0 0 10 10" className={styles.exit}>
          <polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1"></polygon>
        </svg>
      </div>
    </div>
  )
}
