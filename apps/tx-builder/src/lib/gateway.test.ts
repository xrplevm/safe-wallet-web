import { getChainConfig, setBaseUrl } from '@safe-global/safe-gateway-typescript-sdk'
import { configureGateway } from './gateway'

const chain = { chainId: '1440000', chainName: 'XRPL EVM', features: ['TX_SIMULATION'] }
const originalFetch = Object.getOwnPropertyDescriptor(globalThis, 'fetch')

describe('configureGateway', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: jest.fn(async (url: string) => {
        const path = new URL(url).pathname
        const ok = path === '/v1/chains/1440000' || path === '/cgw/v1/chains/1440000'
        return { ok, json: async () => (ok ? chain : { code: 404, message: `Cannot GET ${path}` }) }
      }),
    })
  })

  afterEach(() => {
    setBaseUrl('https://safe-client.safe.global')
    if (originalFetch) Object.defineProperty(globalThis, 'fetch', originalFetch)
    else Reflect.deleteProperty(globalThis, 'fetch')
  })

  it.each(['', '/', '/cgw', '/cgw/'])('loads chain configuration with gateway suffix "%s"', async (suffix) => {
    configureGateway(`http://localhost:8000${suffix}`)
    await expect(getChainConfig('1440000')).resolves.toEqual(chain)
  })
})
