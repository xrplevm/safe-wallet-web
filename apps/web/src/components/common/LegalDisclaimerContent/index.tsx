import { Typography } from '@mui/material'
import { type ReactElement } from 'react'
import css from './styles.module.css'

const LegalDisclaimerContent = ({
  withTitle = true,
  isSafeApps = true,
}: {
  withTitle?: boolean
  isSafeApps?: boolean
}): ReactElement => (
  <div className={css.disclaimerContainer}>
    {withTitle && (
      <Typography variant="h3" fontWeight={700} my={3}>
        Disclaimer
      </Typography>
    )}
    <div className={css.disclaimerInner}>
      <Typography mb={4}>
        You are now accessing {isSafeApps ? 'third-party apps' : 'a third-party app'}, which we do not own, control,
        maintain or audit. We are not liable for any loss you may suffer in connection with interacting with the{' '}
        {isSafeApps ? 'apps' : 'app'}, which is at your own risk.
      </Typography>

      <Typography>I have read and understood this Disclaimer, and agree to be bound by it.</Typography>
    </div>
  </div>
)

export default LegalDisclaimerContent
