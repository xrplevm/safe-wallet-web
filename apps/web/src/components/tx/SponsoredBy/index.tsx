import chains from '@/config/chains'
import css from './styles.module.css'
import { BRAND_NAME } from '@/config/constants'

export const RELAY_SPONSORS = {
  [chains.gno]: {
    name: 'Gnosis',
    logo: '/images/common/gnosis-chain-logo.png',
  },
  default: {
    name: BRAND_NAME,
    logo: '/images/brand/logo-mark-filled.svg',
  },
}

const SponsoredBy = ({ chainId }: { chainId: string }) => {
  const sponsor = RELAY_SPONSORS[chainId] || RELAY_SPONSORS.default

  return (
    <>
      <img src={sponsor.logo} alt={sponsor.name} className={css.logo} /> {sponsor.name}
    </>
  )
}

export default SponsoredBy
