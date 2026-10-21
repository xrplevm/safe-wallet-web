import { type ReactElement } from 'react'
import { SvgIcon } from '@mui/material'

import { HypernativeTooltip } from '@/features/hypernative/components/HypernativeTooltip'
import SafeShieldIconSvg from '@/public/images/security/security-check-icon.svg'

import { safeShieldSvgStyles } from './styles'

/**
 * SafeHeaderHnTooltip component
 * Displays the Security check icon with a Hypernative tooltip
 * Only renders when Hypernative Guard is active
 */
export const SafeHeaderHnTooltip = (): ReactElement | null => {
  return (
    <HypernativeTooltip placement="right">
      <SvgIcon component={SafeShieldIconSvg} inheritViewBox sx={safeShieldSvgStyles} />
    </HypernativeTooltip>
  )
}
