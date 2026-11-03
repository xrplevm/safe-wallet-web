import * as createLogic from '@/components/new-safe/create/logic'
import type { NewSafeFormData } from '@/components/new-safe/create'
import { CreateSafeStatus } from '@/components/new-safe/create/steps/StatusStep'
import { SafeCreationEvent, safeCreationDispatch } from '@/features/counterfactual/services'
import * as useChainId from '@/hooks/useChainId'
import * as useChains from '@/hooks/useChains'
import { act, render } from '@/tests/test-utils'
import { type Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import type { SafeState } from '@safe-global/store/gateway/AUTO_GENERATED/safes'
import { PayMethod } from '@safe-global/utils/features/counterfactual/types'
import { PendingSafeStatus, type UndeployedSafe } from '@safe-global/utils/features/counterfactual/store/types'
import { LATEST_SAFE_VERSION } from '@safe-global/utils/config/constants'
import { type SafeVersion } from '@safe-global/types-kit'

// jsdom has no Web Animations API, which the spinner uses on SUCCESS
jest.mock('@/components/new-safe/create/steps/StatusStep/LoadingSpinner', () => ({
  __esModule: true,
  default: () => null,
  SpinnerStatus: { ERROR: 'isError', SUCCESS: 'isSuccess', PROCESSING: 'isProcessing' },
}))

const mockChain = { chainId: '100', shortName: 'gno' } as Chain
const safeAddress = '0x0000000000000000000000000000000000000123'
const otherSafeAddress = '0x0000000000000000000000000000000000000456'

const mockData: NewSafeFormData = {
  name: 'Test',
  networks: [mockChain],
  threshold: 1,
  owners: [{ name: '', address: '0x1' }],
  saltNonce: 0,
  safeVersion: LATEST_SAFE_VERSION as SafeVersion,
  safeAddress,
}

const dispatchSuccess = (address: string, chainId = mockChain.chainId) =>
  safeCreationDispatch(SafeCreationEvent.SUCCESS, {
    groupKey: 'group',
    safeAddress: address,
    type: PayMethod.PayNow,
    chainId,
  })

const dispatchIndexed = (address: string, chainId = mockChain.chainId) =>
  safeCreationDispatch(SafeCreationEvent.INDEXED, { groupKey: 'group', safeAddress: address, chainId })

const dispatchCompletion = (address: string, chainId = mockChain.chainId) => {
  dispatchSuccess(address, chainId)
  dispatchIndexed(address, chainId)
}

const deferPollSafeInfo = () => {
  const deferred = Promise.withResolvers<SafeState>()
  jest.mocked(createLogic.pollSafeInfo).mockReturnValue(deferred.promise)
  return deferred
}

const pendingPayNowSafe = (status: PendingSafeStatus, submittedAt?: number): UndeployedSafe => ({
  props: {
    factoryAddress: '0x0000000000000000000000000000000000000004',
    masterCopy: '0x0000000000000000000000000000000000000005',
    safeAccountConfig: {
      owners: ['0x0000000000000000000000000000000000000001'],
      threshold: 1,
      fallbackHandler: '0x0000000000000000000000000000000000000006',
      to: '0x0000000000000000000000000000000000000000',
      data: '0x',
      paymentReceiver: '0x0000000000000000000000000000000000000000',
    },
    safeVersion: '1.4.1',
    saltNonce: '0',
  },
  status: { status, type: PayMethod.PayNow, submittedAt },
})

const renderStatus = (push = jest.fn(), pendingSafes: Record<string, UndeployedSafe> = {}) =>
  render(<CreateSafeStatus data={mockData} onSubmit={jest.fn()} onBack={jest.fn()} setStep={jest.fn()} />, {
    routerProps: { push },
    initialReduxState: { undeployedSafes: { [mockChain.chainId]: pendingSafes } },
  })

describe('CreateSafeStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(useChains, 'useCurrentChain').mockReturnValue(mockChain)
    jest.spyOn(useChainId, 'default').mockReturnValue(mockChain.chainId)
    jest.spyOn(createLogic, 'pollSafeInfo').mockResolvedValue({} as SafeState)
  })

  it.each([
    ['in the same tick', () => act(() => dispatchCompletion(safeAddress))],
    [
      'in separate ticks',
      () => {
        act(() => dispatchSuccess(safeAddress))
        act(() => dispatchIndexed(safeAddress))
      },
    ],
  ])(
    'should redirect once to the new Safe after it is indexed when INDEXED follows SUCCESS %s',
    async (_, dispatchEvents) => {
      const push = jest.fn()
      const poll = deferPollSafeInfo()
      const { getByText } = renderStatus(push)

      dispatchEvents()

      expect(createLogic.pollSafeInfo).toHaveBeenCalledTimes(1)
      expect(createLogic.pollSafeInfo).toHaveBeenCalledWith(mockChain.chainId, safeAddress)
      expect(push).not.toHaveBeenCalled()
      expect(getByText('Your multisig account is being indexed..')).toBeInTheDocument()

      await act(async () => poll.resolve({} as SafeState))

      expect(push).toHaveBeenCalledTimes(1)
      expect(push).toHaveBeenCalledWith({ pathname: '/home', query: { safe: `gno:${safeAddress}` } })
    },
  )

  it('should offer a link instead of redirecting when the Safe is never indexed', async () => {
    const push = jest.fn()
    const poll = deferPollSafeInfo()
    const { findByRole, queryByText } = renderStatus(push)

    act(() => dispatchCompletion(safeAddress))
    await act(async () => poll.reject(new Error('Not found')))

    expect(push).not.toHaveBeenCalled()
    expect(await findByRole('link', { name: 'Open account' })).toHaveAttribute(
      'href',
      `/home?safe=gno%3A${safeAddress}`,
    )
    expect(queryByText('Try again')).not.toBeInTheDocument()
  })

  it('should not redirect when the screen closes before the Safe is indexed', async () => {
    const push = jest.fn()
    const poll = deferPollSafeInfo()
    const { unmount } = renderStatus(push)

    act(() => dispatchCompletion(safeAddress))
    unmount()
    await act(async () => poll.resolve({} as SafeState))

    expect(push).not.toHaveBeenCalled()
  })

  it('should not redirect when the creation fails while waiting for the gateway', async () => {
    const push = jest.fn()
    const poll = deferPollSafeInfo()
    const { getByText } = renderStatus(push)

    act(() => dispatchCompletion(safeAddress))
    act(() => {
      safeCreationDispatch(SafeCreationEvent.FAILED, { groupKey: 'group', safeAddress, error: new Error('Reverted') })
    })
    await act(async () => poll.resolve({} as SafeState))

    expect(push).not.toHaveBeenCalled()
    expect(getByText('Try again')).toBeInTheDocument()
  })

  it('should hide the slow transaction warning once the Safe is created', () => {
    jest.useFakeTimers()
    deferPollSafeInfo()
    const { queryByText } = renderStatus(jest.fn(), {
      [safeAddress]: pendingPayNowSafe(PendingSafeStatus.PROCESSING, Date.now() - 60_000),
    })

    act(() => jest.advanceTimersByTime(1_000))
    expect(queryByText('Transaction is taking too long')).toBeInTheDocument()

    act(() => dispatchCompletion(safeAddress))
    expect(queryByText('Transaction is taking too long')).not.toBeInTheDocument()

    jest.useRealTimers()
  })

  it('should only follow the events of the submitted Safe', async () => {
    const push = jest.fn()

    const { queryByText } = renderStatus(push, {
      // An old failed pay-now Safe that is still pending
      [otherSafeAddress]: pendingPayNowSafe(PendingSafeStatus.AWAITING_EXECUTION),
    })

    act(() => {
      safeCreationDispatch(SafeCreationEvent.FAILED, {
        groupKey: 'group',
        safeAddress: otherSafeAddress,
        error: new Error('Transaction not found'),
      })
      dispatchCompletion(otherSafeAddress)
      dispatchCompletion(safeAddress, '1')
    })

    expect(queryByText('Try again')).not.toBeInTheDocument()
    expect(push).not.toHaveBeenCalled()

    await act(async () => dispatchCompletion(safeAddress))

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith({ pathname: '/home', query: { safe: `gno:${safeAddress}` } })
  })
})
