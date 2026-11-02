import type { NewSafeFormData } from '@/components/new-safe/create'
import { CreateSafeStatus } from '@/components/new-safe/create/steps/StatusStep'
import { SafeCreationEvent, safeCreationDispatch } from '@/features/counterfactual/services'
import * as useChainId from '@/hooks/useChainId'
import * as useChains from '@/hooks/useChains'
import { act, render } from '@/tests/test-utils'
import { type Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import { PayMethod } from '@safe-global/utils/features/counterfactual/types'
import { PendingSafeStatus } from '@safe-global/utils/features/counterfactual/store/types'
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

describe('CreateSafeStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(useChains, 'useCurrentChain').mockReturnValue(mockChain)
    jest.spyOn(useChainId, 'default').mockReturnValue(mockChain.chainId)
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
  ])('should redirect once to the new Safe when INDEXED follows SUCCESS %s', (_, dispatchEvents) => {
    const push = jest.fn()

    render(<CreateSafeStatus data={mockData} onSubmit={jest.fn()} onBack={jest.fn()} setStep={jest.fn()} />, {
      routerProps: { push },
    })

    dispatchEvents()

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith({ pathname: '/home', query: { safe: `gno:${safeAddress}` } })
  })

  it('should only follow the events of the submitted Safe', () => {
    const push = jest.fn()

    const { queryByText } = render(
      <CreateSafeStatus data={mockData} onSubmit={jest.fn()} onBack={jest.fn()} setStep={jest.fn()} />,
      {
        routerProps: { push },
        initialReduxState: {
          undeployedSafes: {
            // An old failed pay-now Safe that is still pending
            [mockChain.chainId]: {
              [otherSafeAddress]: {
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
                status: { status: PendingSafeStatus.AWAITING_EXECUTION, type: PayMethod.PayNow },
              },
            },
          },
        },
      },
    )

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

    act(() => dispatchCompletion(safeAddress))

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith({ pathname: '/home', query: { safe: `gno:${safeAddress}` } })
  })
})
