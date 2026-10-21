import type { ReactElement } from 'react'
import { Typography } from '@mui/material'
import { styles } from './constants'

const IntroText = (): ReactElement => {
  return (
    <Typography variant="body2" sx={styles.introText}>
      This app uses necessary cookies to work. By clicking &quot;Accept all&quot; you additionally agree to the use of
      Beamer and Analytics cookies as listed below.
    </Typography>
  )
}

export default IntroText
