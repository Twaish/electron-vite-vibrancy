import { WindowControls } from './WindowControls'
import styles from './Titlebar.module.css'
import { useAppRegion } from '@/lib/hooks/useAppRegion'

interface TitlebarProps {
  children?: React.ReactNode
}

export const Titlebar = ({ children }: TitlebarProps): JSX.Element => {
  const appRegionRef = useAppRegion<HTMLDivElement>()
  return (
    <div className={styles.titlebar} ref={appRegionRef}>
      <div className={styles.content}>{children}</div>
      <WindowControls />
    </div>
  )
}
