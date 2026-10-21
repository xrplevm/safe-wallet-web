import { useRouter } from 'next/router'
import type { UrlObject } from 'url'

import { AppRoutes } from '@/config/routes'

// Transaction Builder app hosted by the operator. Without it, links open the app list instead.
const TX_BUILDER_URL = process.env.NEXT_PUBLIC_TX_BUILDER_URL || ''

export const useTxBuilderApp = (): { link: UrlObject } => {
  const router = useRouter()

  return {
    link: TX_BUILDER_URL
      ? { pathname: AppRoutes.apps.open, query: { safe: router.query.safe, appUrl: TX_BUILDER_URL } }
      : { pathname: AppRoutes.apps.index, query: { safe: router.query.safe } },
  }
}
