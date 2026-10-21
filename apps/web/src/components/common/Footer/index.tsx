import type { ReactElement, ReactNode } from 'react'
import { SvgIcon } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import Link from 'next/link'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { AppRoutes } from '@/config/routes'
import { APP_VERSION, APP_HOMEPAGE } from '@/config/version'
import ExternalLink from '../ExternalLink'
import MUILink from '@mui/material/Link'
import { HELP_CENTER_URL } from '@safe-global/utils/config/constants'
import { IS_PRODUCTION, COMMIT_HASH } from '@/config/constants'
import type { FooterProps } from './footer.type'

const footerPages = [AppRoutes.settings.index, AppRoutes.licenses]

const FooterLink = ({ children, href }: { children: ReactNode; href: string }): ReactElement => {
  return href ? (
    <Link href={href} passHref legacyBehavior>
      <MUILink>{children}</MUILink>
    </Link>
  ) : (
    <MUILink>{children}</MUILink>
  )
}

const Footer: React.FC<FooterProps> = ({
  forceShow,
  preferences = true,
  versionIcon = true,
  helpCenter = true,
  className = css.container,
}): ReactElement | null => {
  const router = useRouter()

  if (!footerPages.some((path) => router.pathname.startsWith(path)) && !forceShow) {
    return null
  }

  return (
    <footer className={className}>
      <ul>
        <li>
          <FooterLink href={router.pathname === AppRoutes.licenses ? '' : AppRoutes.licenses}>Licenses</FooterLink>
        </li>
        {preferences && (
          <li>
            <FooterLink href={router.pathname === AppRoutes.settings.index ? '' : AppRoutes.settings.index}>
              Preferences
            </FooterLink>
          </li>
        )}
        {helpCenter && (
          <li>
            <ExternalLink href={HELP_CENTER_URL} noIcon sx={{ span: { textDecoration: 'underline' } }}>
              Help
            </ExternalLink>
          </li>
        )}

        <li>
          <ExternalLink href={`${APP_HOMEPAGE}/releases/tag/v${APP_VERSION}`} noIcon>
            {versionIcon && <SvgIcon component={GitHubIcon} inheritViewBox fontSize="inherit" sx={{ mr: 0.5 }} />}v
            {APP_VERSION}
          </ExternalLink>
        </li>

        {!IS_PRODUCTION && COMMIT_HASH && (
          <li>
            <ExternalLink href={`${APP_HOMEPAGE}/commit/${COMMIT_HASH}`} noIcon>
              {COMMIT_HASH.slice(0, 7)}
            </ExternalLink>
          </li>
        )}
      </ul>
    </footer>
  )
}

export default Footer
