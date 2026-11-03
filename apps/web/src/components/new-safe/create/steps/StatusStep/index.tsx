import { useCounter } from '@/components/common/Notifications/useCounter'
import type { StepRenderProps } from '@/components/new-safe/CardStepper/useCardStepper'
import type { NewSafeFormData } from '@/components/new-safe/create'
import { getRedirect, pollSafeInfo } from '@/components/new-safe/create/logic'
import StatusMessage from '@/components/new-safe/create/steps/StatusStep/StatusMessage'
import useUndeployedSafe from '@/components/new-safe/create/steps/StatusStep/useUndeployedSafe'
import { lightPalette } from '@safe-global/theme'
import { AppRoutes } from '@/config/routes'
import { safeCreationPendingStatuses } from '@/features/counterfactual'
import { SafeCreationEvent, safeCreationSubscribe, isPredictedSafeProps } from '@/features/counterfactual/services'
import { useCurrentChain } from '@/hooks/useChains'
import Rocket from '@/public/images/common/rocket.svg'
import { CREATE_SAFE_EVENTS, trackEvent } from '@/services/analytics'
import { useAppDispatch } from '@/store'
import { Alert, AlertTitle, Box, Button, Paper, Stack, SvgIcon, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { sameAddress } from '@safe-global/utils/utils/addresses'
import { getLatestSafeVersion } from '@safe-global/utils/utils/chains'

const SPEED_UP_THRESHOLD_IN_SECONDS = 15

export const CreateSafeStatus = ({
  data,
  setProgressColor,
  setStep,
  setStepData,
}: StepRenderProps<NewSafeFormData>) => {
  const [status, setStatus] = useState<SafeCreationEvent>(SafeCreationEvent.PROCESSING)
  const [isIndexed, setIsIndexed] = useState(false)
  const [isIndexingSlow, setIsIndexingSlow] = useState(false)
  const [safeAddress, pendingSafe] = useUndeployedSafe()
  const hasRedirected = useRef(false)
  const router = useRouter()
  const chain = useCurrentChain()
  const chainId = chain?.chainId
  const dispatch = useAppDispatch()

  const counter = useCounter(pendingSafe?.status.submittedAt)

  const isError = status === SafeCreationEvent.FAILED || status === SafeCreationEvent.REVERTED
  // INDEXED can follow SUCCESS in the same tick, so the screen may never render SUCCESS
  const isCreated = status === SafeCreationEvent.SUCCESS || status === SafeCreationEvent.INDEXED

  useEffect(() => {
    const unsubFns = Object.entries(safeCreationPendingStatuses).map(([event]) =>
      safeCreationSubscribe(event as SafeCreationEvent, async (detail) => {
        // Other pending Safes, also on other chains, can send events while this screen is open
        const isOtherChain = 'chainId' in detail && detail.chainId !== chainId
        if (isOtherChain || !sameAddress(detail.safeAddress, data.safeAddress)) return
        setStatus(event as SafeCreationEvent)
      }),
    )

    return () => {
      unsubFns.forEach((unsub) => unsub())
    }
  }, [chainId, data.safeAddress])

  // INDEXED does not wait for the gateway here, so wait for it before opening the Safe
  useEffect(() => {
    if (!isCreated || !chainId || !data.safeAddress) return

    let isCancelled = false
    pollSafeInfo(chainId, data.safeAddress)
      .then(() => !isCancelled && setIsIndexed(true))
      .catch(() => !isCancelled && setIsIndexingSlow(true))

    return () => {
      isCancelled = true
    }
  }, [isCreated, chainId, data.safeAddress])

  useEffect(() => {
    if (!chain || !data.safeAddress || !isIndexed || hasRedirected.current) return

    const redirect = getRedirect(chain.shortName, data.safeAddress, router.query?.safeViewRedirectURL)
    if (typeof redirect !== 'string' || redirect.startsWith('/')) {
      hasRedirected.current = true
      router.push(redirect)
    }
  }, [dispatch, chain, data.name, data.owners, data.threshold, data.safeAddress, router, isIndexed])

  useEffect(() => {
    if (!setProgressColor) return

    if (isError) {
      setProgressColor(lightPalette.error.main)
    } else {
      setProgressColor(lightPalette.secondary.main)
    }
  }, [isError, setProgressColor])

  const tryAgain = () => {
    trackEvent(CREATE_SAFE_EVENTS.RETRY_CREATE_SAFE)

    if (!pendingSafe || !isPredictedSafeProps(pendingSafe.props)) {
      setStep(0)
      return
    }

    setProgressColor?.(lightPalette.secondary.main)
    setStep(2)
    setStepData?.({
      owners: pendingSafe.props.safeAccountConfig.owners.map((owner) => ({ name: '', address: owner })),
      name: '',
      networks: [],
      threshold: pendingSafe.props.safeAccountConfig.threshold,
      saltNonce: Number(pendingSafe.props.safeDeploymentConfig?.saltNonce),
      safeAddress,
      safeVersion: pendingSafe.props.safeDeploymentConfig?.safeVersion ?? getLatestSafeVersion(chain),
    })
  }

  const onCancel = () => {
    trackEvent(CREATE_SAFE_EVENTS.CANCEL_CREATE_SAFE)
  }

  return (
    <Paper
      sx={{
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 8 },
        }}
      >
        <StatusMessage
          // While waiting for the gateway, show the "being indexed" step even if INDEXED already arrived
          status={isCreated && !isIndexed && !isIndexingSlow ? SafeCreationEvent.SUCCESS : status}
          isError={isError}
          pendingSafe={pendingSafe}
        />

        {counter && counter > SPEED_UP_THRESHOLD_IN_SECONDS && !isError && !isCreated && (
          <Alert severity="warning" icon={<SvgIcon component={Rocket} />} sx={{ mt: 5 }}>
            <AlertTitle>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}
              >
                Transaction is taking too long
              </Typography>
            </AlertTitle>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'left',
              }}
            >
              Try to speed it up with better gas parameters in your wallet.
            </Typography>
          </Alert>
        )}

        {isIndexingSlow && chain && (
          <Stack sx={{ mt: 5, gap: 2, alignItems: 'center' }}>
            <Typography variant="body2">
              Your account is created, but it is still being indexed. It can take a few more minutes.
            </Typography>
            <Link
              href={{ pathname: AppRoutes.home, query: { safe: `${chain.shortName}:${data.safeAddress}` } }}
              passHref
            >
              <Button variant="contained">Open account</Button>
            </Link>
          </Stack>
        )}

        {isError && (
          <Stack
            direction="row"
            sx={{
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Link href={AppRoutes.welcome.index} passHref>
              <Button variant="outlined" onClick={onCancel}>
                Go to homepage
              </Button>
            </Link>
            <Button variant="contained" onClick={tryAgain}>
              Try again
            </Button>
          </Stack>
        )}
      </Box>
    </Paper>
  )
}
