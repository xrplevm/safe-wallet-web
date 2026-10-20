import { Typography } from '@mui/material'

import css from './styles.module.css'

const WidgetDisclaimer = ({ widgetName }: { widgetName: string }) => (
  <div className={css.disclaimerContainer}>
    <div className={css.disclaimerInner}>
      <Typography mb={4} mt={4}>
        You are now accessing a third party widget.
      </Typography>

      <Typography mb={4}>
        Please note that we do not own, control, maintain or audit the {widgetName}. Use of the widget is subject to
        third party terms & conditions. We are not liable for any loss you may suffer in connection with interacting
        with the widget, which is at your own risk.
      </Typography>

      <Typography>
        By clicking &quot;continue&quot; you re-confirm to have read and understood this message, and agree to it.
      </Typography>
    </div>
  </div>
)

export default WidgetDisclaimer
